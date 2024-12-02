import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ResultsContainerEliminados from './ResultsContainerEliminados' // Importa el nuevo componente
import { useAuth } from '../../context/AuthContext'

const ArchivosEliminados = () => {
  const [deletedFiles, setDeletedFiles] = useState([])
  const [page, setPage] = useState(1)
  const pageSize = 50
  const [totalCount, setTotalCount] = useState(0)
  const { token } = useAuth()

  useEffect(() => {
    const fetchDeletedFiles = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/deleted/deleted',
          {
            params: {
              page,
              pageSize
            },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setDeletedFiles(response.data.results)
        setTotalCount(response.data.totalCount)
      } catch (error) {
        console.error('Error al obtener archivos eliminados:', error)
        if (error.response && error.response.status === 401) {
          console.log('Token inválido')
          // Redirige al login o muestra un mensaje de error
          // Por ejemplo:
          //  Swal.fire({
          //   title: 'Error',
          //   text: 'Token inválido. Por favor, inicie sesión nuevamente.',
          //   icon: 'error'
          // }).then(() => {
          //   // Redireccionar al login
          //   window.location.href = '/login'; // O usa un router como react-router-dom
          // });
        }
      }
    }

    fetchDeletedFiles()
  }, [page, token])

  const handleDeletePermanently = async (documentoId) => {
    // ... (Código existente sin cambios)
  }

  const handleRestoreFile = async (documentoId) => {
    // ... (Código existente sin cambios)
  }

  const handleNextPage = () => setPage(page + 1)
  const handlePreviousPage = () => setPage(page - 1)

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div>
      <h1>Archivos Eliminados</h1>

      {/* Usa ResultsContainerEliminados */}
      <ResultsContainerEliminados
        results={deletedFiles}
        onDeletePermanently={handleDeletePermanently}
        onRestore={handleRestoreFile}
      />

      <div className="pagination">
        {' '}
        {/* Agrega una clase para estilizar la paginación */}
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default ArchivosEliminados

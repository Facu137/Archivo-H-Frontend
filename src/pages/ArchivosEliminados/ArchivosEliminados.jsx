import React, { useState, useEffect, useCallback } from 'react'
import ResultsContainerEliminados from './ResultsContainerEliminados'
import { useAuth } from '../../context/AuthContext'
import { archivoService } from '../../services/archivo.service'
import { Alert } from 'react-bootstrap'

const ArchivosEliminados = () => {
  const [deletedFiles, setDeletedFiles] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const pageSize = 50
  const [totalCount, setTotalCount] = useState(0)
  useAuth()

  const fetchDeletedFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await archivoService.obtenerArchivosEliminados({
        page,
        pageSize
      })
      setDeletedFiles(response.data.results)
      setTotalCount(response.data.totalCount)
    } catch (error) {
      console.error('Error al obtener archivos eliminados:', error)
      setError(
        error.response?.data?.message ||
          'Error al obtener los archivos eliminados'
      )
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchDeletedFiles()
  }, [fetchDeletedFiles])

  const handleDeletePermanently = async (documentoId) => {
    try {
      await archivoService.eliminarPermanentemente(documentoId)
      // Actualizar la lista después de eliminar
      fetchDeletedFiles()
    } catch (error) {
      console.error('Error al eliminar permanentemente:', error)
      setError(
        error.response?.data?.message ||
          'Error al eliminar permanentemente el archivo'
      )
    }
  }

  const handleRestoreFile = async (documentoId) => {
    try {
      await archivoService.restaurarArchivo(documentoId)
      // Actualizar la lista después de restaurar
      fetchDeletedFiles()
    } catch (error) {
      console.error('Error al restaurar archivo:', error)
      setError(error.response?.data?.message || 'Error al restaurar el archivo')
    }
  }

  const handleNextPage = () => setPage(page + 1)
  const handlePreviousPage = () => setPage(page - 1)

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="container py-4">
      <h1 className="mb-4">Archivos Eliminados</h1>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <ResultsContainerEliminados
            results={deletedFiles}
            onDeletePermanently={handleDeletePermanently}
            onRestore={handleRestoreFile}
          />

          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button
              className="btn btn-outline-primary"
              onClick={handlePreviousPage}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span>
              Página {page} de {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ArchivosEliminados

import React from 'react'
import './ResultCard.css'

const ResultCard = ({ result }) => {
  const { id, date } = result
  const caratula = 'Caratula del documento ' + id
  const iniciador = 'Iniciador del documento ' + id
  const tema = 'Tema del documento ' + id
  const folios = 'Folios del documento ' + id

  return (
    <div
      className="result-card"
      onClick={() => (window.location.href = 'visualizador.html')}
    >
      <div className="card-content">
        <p>
          <strong>Caratula:</strong> {caratula}
        </p>
        <p>
          <strong>Iniciador:</strong> {iniciador}
        </p>
        <p>
          <strong>Tema:</strong> {tema}
        </p>
        <p>
          <strong>Fecha:</strong> {date}
        </p>
        <p>
          <strong>Folios:</strong> {folios}
        </p>
      </div>
      <div className="miniatura">
        <img src="imagen-miniatura.jpg" alt="Miniatura" />
      </div>
    </div>
  )
}

export default ResultCard

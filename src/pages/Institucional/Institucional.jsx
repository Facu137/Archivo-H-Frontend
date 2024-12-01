import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import libro from '../../assets/libro.avif'
import libro2 from '../../assets/libro2.avif'
import img1728590488906 from '../../assets/1728590488906.avif'
import personas from '../../assets/personas.avif'
import archivo from '../../assets/archivo.avif'
import img1728590524186 from '../../assets/1728590524186.avif'
import img43 from '../../assets/img43.avif'
import img48 from '../../assets/img48.avif'
import img49 from '../../assets/img49.avif'
import img69 from '../../assets/img69.avif'
import img72 from '../../assets/img72.avif'
import img77 from '../../assets/img77.avif'
import img78 from '../../assets/img78.avif'
import img79 from '../../assets/img79.avif'
import img80 from '../../assets/img80.avif'
import img81 from '../../assets/img81.avif'
import img95 from '../../assets/img95.avif'
import img105 from '../../assets/img105.avif'
import img115 from '../../assets/img115.avif'
import img124 from '../../assets/img124.avif'
import img129 from '../../assets/img129.avif'
import img134 from '../../assets/img134.avif'
import img149 from '../../assets/img149.avif'
import img154 from '../../assets/img154.avif'
import ImageModal from './ImageModal'

const timelineData = [
  {
    year: '1910',
    title: 'Fundación del Archivo General',
    text: 'El Archivo General de Santiago del Estero fue fundado el 26 de Agosto de 1910, mediante Ley N° 267 por la Cámara de Representantes de la Provincia.',
    images: [libro, libro2]
  },
  {
    year: '1941',
    title: 'Organización Sistemática',
    text: 'En el año 1941, bajo el gobierno del Dr.José Ignacio Cáceres, se aprobó la Ley N° 1733, razón por la cual se realiza la organización sistemática del Archivo General, creándose entre otras, la sección "documentos históricos".',
    images: [personas, archivo, img1728590488906]
  },
  {
    year: '1993',
    title: 'Diciembre de 1993: El Santiagueñazo',
    text: 'Con los acontecimientos acaecidos en el Santiagueñazo, el fuego y el agua dejaron graves secuelas en el Archivo General, perdiéndose para siempre numerosos documentos. El Archivo General funcionaba en el Subsuelo del Palacio de los Tribunales',
    images: [img1728590524186, img43]
  },
  {
    year: '1993',
    title: 'El incendio',
    text: 'El Archivo General funcionaba en el Subsuelo del Palacio de los Tribunales',
    images: [img48, img49]
  },
  {
    year: '2008',
    title: 'El Archivo Histórico',
    text: 'Fue creado el 05 de febrero de 2008 mediante decreto N°110/08, por el actual Gobierno de la Provincia. Esta integrado por todos los documentos anteriores al año 1.900 que formaban parte de la "sección histórica" del Archivo General. Estas fuentes documentales son: Expedientes Judiciales, Protocolos Notariales, Tierras Fiscales, Documentos Coloniales, Correspondencias, Expedientes de Gobierno, Leyes y Decretos, Mensuras, Libros, Boletines y Revistas, Hemeroteca.',
    images: []
  },
  {
    year: '2008',
    title: 'Se recuperaron',
    text: 'Las Actas Capitulares originales, y con ellas el ACTA DE LA AUTONOMIA',
    images: [img69, img72]
  },
  {
    year: '2008',
    title: 'Algunas colecciones valiosas',
    text: '',
    images: [img77, img78]
  },
  {
    year: '2008',
    title: 'Documentos antiguos',
    text: '',
    images: [img80, img79, img81]
  },
  {
    year: '2008',
    title: 'Remodelación',
    text: 'El 3 de marzo del año 2008, comenzó la remodelación de su nuevo local',
    images: [img95, img105, img115]
  },
  {
    year: '2021',
    title: 'Digitalizaciones',
    text: 'Estamos realizando digitalizaciones, llegando hasta la fecha unas 287.400 fotografías.',
    images: [img124, img129, img134, img149, img154]
  },
  {
    year: '2021',
    title: 'Nueva Sede',
    text: 'Es necesario que todos asumamos el compromiso de proteger y conservar los fondos documentales, que son patrimonio de los pueblos, y asegurar los mismos para las generaciones futuras. En julio de 2021, inauguramos nuestra nueva cede y definitiva, en Calle Mitre 127, donde fuera la casa del Patriarca del Folklore Argentino, Don Andrés A. Chazarreta, la cual logramos recuperar y donde hoy funcionan las Salas Museos Cahzarreta y el Archivo Histórico de la Provincia.',
    images: []
  }
]

const Institucional = () => {
  const { isDarkMode } = useTheme()
  const observerRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    // Scroll suave al inicio cuando se monta el componente
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
          const img = entry.target.querySelector('img')
          if (img && img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
          }
        }
      })
    }, options)

    document.querySelectorAll('.timeline-item').forEach((item) => {
      observerRef.current.observe(item)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const handleImageClick = (image, title) => {
    setSelectedImage({ image, title })
  }

  return (
    <div
      className={`min-vh-100 py-5 ${
        isDarkMode ? 'bg-dark text-light' : 'bg-light'
      }`}
    >
      <style>
        {`
          .timeline-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 1s ease-out;
          }
          
          .timeline-item.show {
            opacity: 1;
            transform: translateY(0);
          }

          .timeline-line {
            position: relative;
          }

          .timeline-line::before {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 100%;
            background: var(--bs-primary);
          }

          .image-carousel {
            position: relative;
            overflow: hidden;
          }

          .image-carousel img {
            transition: transform 0.5s ease-in-out;
          }

          .image-carousel:hover img {
            transform: scale(1.05);
          }

          @media (max-width: 768px) {
            .timeline-line::before {
              left: 0;
            }
          }
        `}
      </style>

      <div className="container px-4">
        <h1 className="text-center mb-5">Historia del Archivo Histórico</h1>
        <div className="timeline-line">
          {timelineData.map((item, index) => (
            <div
              key={index}
              className={`timeline-item row mb-5 ${
                index % 2 === 0 ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="col-md-6">
                <div
                  className={`card border-0 shadow h-100 ${
                    isDarkMode ? 'bg-dark text-light' : 'bg-light'
                  }`}
                >
                  <div
                    className={`card-header border-bottom py-3 ${
                      isDarkMode ? 'bg-dark' : 'bg-light'
                    }`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h3 className="h4 m-0">{item.title}</h3>
                      <span className="badge bg-primary">{item.year}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="mb-4">{item.text}</p>
                    {item.images.length > 0 && (
                      <div className="row g-3">
                        {item.images.map((img, imgIndex) => (
                          <div
                            key={imgIndex}
                            className={`col-${12 / Math.min(3, item.images.length)}`}
                          >
                            <div className="image-carousel">
                              <img
                                src={img} // Cambiamos para cargar la imagen directamente
                                alt={`${item.title} - Imagen ${imgIndex + 1}`}
                                className="img-fluid rounded shadow-sm"
                                style={{
                                  aspectRatio: '1/1',
                                  objectFit: 'cover',
                                  width: '100%',
                                  cursor: 'pointer',
                                  backgroundColor: isDarkMode
                                    ? '#2b3035'
                                    : '#e9ecef' // Añadimos color de fondo mientras carga
                                }}
                                onClick={() =>
                                  handleImageClick(img, item.title)
                                }
                                onError={(e) => {
                                  console.error(`Error loading image: ${img}`)
                                  e.target.style.display = 'none' // Ocultar imagen si hay error
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedImage && (
        <ImageModal
          image={selectedImage.image}
          title={selectedImage.title}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
}

export default Institucional

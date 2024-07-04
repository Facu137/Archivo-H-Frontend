import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import Tiff from 'tiff.js';
import Viewer from 'react-viewer';
import './VerArchivo.css';

export const VerArchivo = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fileUrl) {
      const fileExtension = fileUrl.split('.').pop().toLowerCase();

      if (fileExtension === 'pdf') {
        setImage(null);
        setVisible(false);
      } else if (fileExtension === 'tiff' || fileExtension === 'tif') {
        fetch(fileUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener el archivo TIFF');
            }
            return response.arrayBuffer();
          })
          .then(buffer => {
            try {
              const tiff = new Tiff({ buffer });
              const canvas = tiff.toCanvas();
              setImage(canvas.toDataURL());
              setVisible(true);
            } catch (error) {
              setError('Error al procesar el archivo TIFF');
              console.error('Error al procesar el archivo TIFF:', error);
            }
          })
          .catch(error => {
            setError('Error al cargar el archivo TIFF');
            console.error('Error al cargar el archivo TIFF:', error);
          });
      } else if (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png') {
        setImage(fileUrl);
        setVisible(true);
      } else {
        setError('Tipo de archivo no soportado');
      }
    }
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="ver-archivo-container">
      {error && <div className="error">{error}</div>}
      {fileUrl && (
        <div>
          {fileUrl.endsWith('.pdf') ? (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                setError('Error al cargar el PDF');
                console.error('Error al cargar el PDF:', error);
              }}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          ) : (
            <Viewer
              visible={visible}
              onClose={() => setVisible(false)}
              images={[{ src: image, alt: 'archivo' }]}
              noNavbar
              noToolbar
              noImgDetails
              zoomSpeed={0.2}
              drag={true}
              rotatable={false}
              scalable={false}
              downloadable={false}
              changeable={false}
              attribute={false}
              customToolbar={() => null}
            />
          )}
          <div className="watermark">Archivo Histórico de Santiago Del Estero</div>
        </div>
      )}
      <div className="warning">
        Este documento es propiedad del Archivo histórico de Santiago Del Estero. Está prohibido su distribución mas allá de nuestro sitio web.
      </div>
    </div>
  );
};
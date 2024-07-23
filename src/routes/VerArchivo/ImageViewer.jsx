// src/routes/VerArchivo/ImageViewer.jsx
import React, { useEffect, useState } from 'react';
import './ImageViewer.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Tiff from 'tiff.js';

const ImageViewer = ({ fileUrl }) => {
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (fileUrl) {
      const fileExtension = fileUrl.split('.').pop().toLowerCase();
      if (fileExtension === 'tiff' || fileExtension === 'tif') {
        fetch(fileUrl)
          .then(response => response.arrayBuffer())
          .then(buffer => {
            const tiff = new Tiff({ buffer });
            const canvas = tiff.toCanvas();
            setImageSrc(canvas.toDataURL());
          })
          .catch(error => {
            console.error('Error al cargar el archivo TIFF', error);
          });
      } else {
        setImageSrc(fileUrl);
      }
    }
  }, [fileUrl]);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && (e.key === 'p' || e.key === 's')) || (e.metaKey && (e.key === 'p' || e.key === 's'))) {
        e.preventDefault();
        alert('La captura de pantalla se encuentra deshabilitada');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="image-viewer-container">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={5}
        wheel={{ disabled: false }}
        pinch={{ disabled: false }}
        pan={{ disabled: false, velocityDisabled: false }}
        alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent>
          <div className="image-container">
            {imageSrc ? <img src={imageSrc} alt="Imagen" /> : <p>Cargando imagen...</p>}
            {imageSrc && (
              <div className="watermark">
                Archivo Histórico de Santiago Del Estero
              </div>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default ImageViewer;
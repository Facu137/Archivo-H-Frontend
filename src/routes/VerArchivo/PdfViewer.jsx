// src/routes/VerArchivo/PdfViewer.jsx
import React, { useEffect, useState, useRef } from 'react';
import './PdfViewer.css';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min';

const Watermark = () => {
  return (
    <div className="watermark">
      <span>Archivo histórico de Santiago Del Estero</span>
    </div>
  );
};

const PdfViewer = ({ fileUrl }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadingTask = getDocument(fileUrl);
    loadingTask.promise.then(pdf => {
      setPdfDoc(pdf);
      const numPages = pdf.numPages;
      const pagesPromises = [];
      for (let i = 1; i <= numPages; i++) {
        pagesPromises.push(pdf.getPage(i));
      }
      Promise.all(pagesPromises).then(pages => {
        setPages(pages);
      });
    }).catch(error => {
      console.error('Error al cargar el PDF', error);
    });
  }, [fileUrl]);

  const renderPage = (page) => {
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    page.render(renderContext).promise.then(() => {
      const container = containerRef.current;
      const pageContainer = document.createElement('div');
      pageContainer.className = 'page-container';
      pageContainer.appendChild(canvas);
      const watermarkElement = document.createElement('div');
      watermarkElement.className = 'watermark';
      watermarkElement.innerHTML = '<span>Archivo histórico de Santiago Del Estero</span>';
      pageContainer.appendChild(watermarkElement);
      container.appendChild(pageContainer);
    });
  };

  useEffect(() => {
    if (pages.length > 0) {
      containerRef.current.innerHTML = '';
      pages.forEach(renderPage);
    }
  }, [pages]);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      if (event.key === "PrintScreen" || (event.ctrlKey && event.key === "s")) {
        event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "PrintScreen") {
        navigator.clipboard.writeText('').then(() => {
          alert('La captura de pantalla está deshabilitada.');
        }).catch(err => {
          console.error('Error al intentar limpiar el portapapeles: ', err);
        });
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <TransformWrapper
      initialScale={1}
      wheel={{ disabled: false }}
      pinch={{ disabled: false }}
      pan={{ disabled: false, velocityDisabled: false }}
    >
      <TransformComponent>
        <div id="pdf-container" className="pdf-container" ref={containerRef}></div>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default PdfViewer;
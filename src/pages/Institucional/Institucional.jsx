import React, { useRef, useEffect } from 'react';
import libro from '../../assets/libro.avif';
import libro2 from '../../assets/libro2.avif';
import img1728590488906 from '../../assets/1728590488906.avif';
import personas from '../../assets/personas.avif';
import archivo from '../../assets/archivo.avif';
import img1728590524186 from '../../assets/1728590524186.avif';
import img43 from '../../assets/img43.avif';
import img48 from '../../assets/img48.avif';
import img49 from '../../assets/img49.avif';
import img69 from '../../assets/img69.avif';
import img72 from '../../assets/img72.avif';
import img77 from '../../assets/img77.avif';
import img78 from '../../assets/img78.avif';
import img79 from '../../assets/img79.avif';
import img80 from '../../assets/img80.avif';
import img81 from '../../assets/img81.avif';
import img95 from '../../assets/img95.avif';
import img105 from '../../assets/img105.avif';
import img115 from '../../assets/img115.avif';
import img124 from '../../assets/img124.avif';
import img129 from '../../assets/img129.avif';
import img134 from '../../assets/img134.avif';
import img149 from '../../assets/img149.avif';
import img154 from '../../assets/img154.avif';

import './Institucional.css';

const Institucional = () => {
  const imageRefs = useRef([]);
  let imageIndex = 0; // Inicializamos el índice

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.25 });

    imageRefs.current.forEach((image) => {
      if (image) {
        observer.observe(image);
      }
    });

    return () => {
      imageRefs.current.forEach((image) => {
        if (image) {
          observer.unobserve(image);
        }
      });
    };
  }, []);

  const addImageRef = (el) => {
    imageRefs.current[imageIndex] = el;
    imageIndex++; // Incrementamos el índice para la siguiente imagen
  };

  return (
    <div className="institucional-container">
      <div className="institucional-card">
        <h2>Fundación del Archivo General</h2>
        <p>El Archivo General de Santiago del Estero fue fundado el 26 de Agosto de 1910, mediante Ley N° 267 por la Cámara de Representantes de la Provincia.</p>
        <div className="institucional-card-gallery">
          <img src={libro} alt="Fundación del Archivo General" ref={addImageRef} />
          <img src={libro2} alt="Fundación del Archivo General" ref={addImageRef} />
        </div>
      </div>

      <div className="institucional-card">
        <h2>Organización Sistemática</h2>
        <p>En el año 1941, bajo el gobierno del Dr.José Ignacio Cáceres, se aprobó la Ley N° 1733, razón por la cual se realiza la organización sistemática del Archivo General, creándose entre otras, la sección “documentos históricos”.</p>
        <div className="institucional-card-gallery">
          <img src={personas} alt="Organización Sistemática" ref={addImageRef} />
          <img src={archivo} alt="Organización Sistemática" ref={addImageRef}/>
          <img src={img1728590488906} alt="Organización Sistemática" ref={addImageRef}/>
        </div>
      </div>

      <div className="institucional-card">
        <h2>Diciembre de 1993: El Santiagueñazo</h2>
        <p>Con los acontecimientos acaecidos en el Santiagueñazo, el fuego y el agua dejaron graves secuelas en el Archivo General, perdiéndose para siempre numerosos documentos. El Archivo General funcionaba en el Subsuelo del Palacio de los Tribunales</p>
        <div className="institucional-card-gallery">
          <img src={img1728590524186} alt="El Santiagueñazo" ref={addImageRef}/>
          <img src={img43} alt="El Santiagueñazo" ref={addImageRef}/>
        </div>
      </div>

      <div className="institucional-card">
        <h2>El incendio</h2>
        <p>El Archivo General funcionaba en el Subsuelo del Palacio de los Tribunales</p>
        <div className="institucional-card-gallery">
          <img src={img48} alt="El incendio" ref={addImageRef}/>
          <img src={img49} alt="El incendio" ref={addImageRef}/>
        </div>
      </div>

      <div className="institucional-card">
        <h2>El Archivo Histórico</h2>
        <p>Fue creado el 05 de febrero de 2008 mediante decreto N°110/08, 
        por el actual Gobierno de la Provincia. Esta integrado por todos los documentos anteriores al año 1.900 que formaban 
        parte de la “sección histórica” del Archivo General. Estas fuentes documentales son: 
        Expedientes Judiciales, Protocolos Notariales, Tierras Fiscales, Documentos Coloniales, 
        Correspondencias, Expedientes de Gobierno, Leyes y Decretos, Mensuras, Libros, Boletines y Revistas, Hemeroteca.</p>
      </div>

      <div className="institucional-card">
        <h2>Se recuperaron</h2>
        <p>Las Actas Capitulares originales, y con ellas el ACTA DE LA AUTONOMIA</p>
        <div className="institucional-card-gallery">
          <img src={img69} alt="El incendio"ref={addImageRef} />
          <img src={img72} alt="El incendio" ref={addImageRef}/>
        </div>
      </div>

      <div className="institucional-card">
        <h2>Algunas Colecciones valiosas</h2>
        <div className="institucional-card-gallery">
          <img src={img77}ref={addImageRef}/>
          <img src={img78}ref={addImageRef}/>
        </div>
      </div>

      <div className="institucional-card">
        <h2>Algunas colecciones valiosas</h2>
        <p>Las Actas Capitulares originales, y con ellas el ACTA DE LA AUTONOMIA</p>
        <div className="institucional-card-gallery">
          <img src={img69} ref={addImageRef} />
          <img src={img72} ref={addImageRef} />
        </div>
      </div>

      <div className="institucional-card">
        <h2>Documentos antiguos</h2>
        <div className="institucional-card-gallery">
          <img src={img80}ref={addImageRef}/>
          <img src={img79}ref={addImageRef}/>
          <img src={img81}ref={addImageRef}/>

        </div>
      </div>

      <div className="institucional-card">
        <h2>Remodelación</h2>
        <p>El 3 de marzo del año 2008, comenzó la remodelación de su nuevo local</p>
        <div className="institucional-card-gallery">
          <img src={img95}ref={addImageRef}/>
          <img src={img105}ref={addImageRef}/>
          <img src={img115}ref={addImageRef}/>
        </div>
      </div>

      <div className="institucional-card">
        <h2>Digitalizaciones</h2>
        <p>Estamos realizando digitalizaciones, llegando hasta la fecha unas 287.400 fotografías.</p>
        <div className="institucional-card-gallery">
          <img src={img124}ref={addImageRef}/>
          <img src={img129}ref={addImageRef}/>
          <img src={img134}ref={addImageRef}/>
          <img src={img149}ref={addImageRef}/>
          <img src={img154}ref={addImageRef}/>
        </div>
      </div>

    </div>
  );
};

export default Institucional;
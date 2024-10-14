import React from 'react'
import InstitucionalCard from '../../components/InstitucionalCard/InstitucionalCard'
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

import './Institucional.css'

const Institucional = () => {
  return (
    <div className="institucional-container">
      <InstitucionalCard
        title="Fundación del Archivo General"
        text="El Archivo General de Santiago del Estero fue fundado el 26 de Agosto de 1910, mediante Ley N° 267 por la Cámara de Representantes de la Provincia."
        images={[libro, libro2]}
      />

      <InstitucionalCard
        title="Organización Sistemática"
        text="En el año 1941, bajo el gobierno del Dr.José Ignacio Cáceres, se aprobó la Ley N° 1733, razón por la cual se realiza la organización sistemática del Archivo General, creándose entre otras, la sección “documentos históricos”."
        images={[personas, archivo, img1728590488906]}
      />

      <InstitucionalCard
        title="Diciembre de 1993: El Santiagueñazo"
        text="Con los acontecimientos acaecidos en el Santiagueñazo, el fuego y el agua dejaron graves secuelas en el Archivo General, perdiéndose para siempre numerosos documentos. El Archivo General funcionaba en el Subsuelo del Palacio de los Tribunales"
        images={[img1728590524186, img43]}
      />
      <InstitucionalCard
        title="El incendio"
        text="El Archivo General funcionaba en el Subsuelo del Palacio de los Tribunales"
        images={[img48, img49]}
      />

      <InstitucionalCard
        title="El Archivo Histórico"
        text="Fue creado el 05 de febrero de 2008 mediante decreto N°110/08, 
        por el actual Gobierno de la Provincia. Esta integrado por todos los documentos anteriores al año 1.900 que formaban 
        parte de la “sección histórica” del Archivo General. Estas fuentes documentales son: 
        Expedientes Judiciales, Protocolos Notariales, Tierras Fiscales, Documentos Coloniales, 
        Correspondencias, Expedientes de Gobierno, Leyes y Decretos, Mensuras, Libros, Boletines y Revistas, Hemeroteca."
        images={[]} // Sin imágenes
      />

      <InstitucionalCard
        title="Se recuperaron"
        text="Las Actas Capitulares originales, y con ellas el ACTA DE LA AUTONOMIA"
        images={[img69, img72]}
      />

      <InstitucionalCard
        title="Algunas colecciones valiosas"
        images={[img77, img78]} // Sin texto
      />

      <InstitucionalCard
        title="Documentos antiguos"
        images={[img80, img79, img81]} // Sin texto
      />

      <InstitucionalCard
        title="Remodelación"
        text="El 3 de marzo del año 2008, comenzó la remodelación de su nuevo local"
        images={[img95, img105, img115]}
      />

      <InstitucionalCard
        title="Digitalizaciones"
        text="Estamos realizando digitalizaciones, llegando hasta la fecha unas 287.400 fotografías."
        images={[img124, img129, img134, img149, img154]}
      />

      <InstitucionalCard
        text="Es necesario que todos asumamos el compromiso de proteger y conservar los fondos documentales, que son patrimonio de los pueblos, y asegurar los mismos para las generaciones futuras. En julio de 2021, inauguramos nuestra nueva cede y definitiva, en Calle Mitre 127, donde fuera la casa del Patriarca del Folklore Argentino, Don Andrés A. Chazarreta, la cual logramos recuperar y donde hoy funcionan las Salas Museos Cahzarreta y el Archivo Histórico de la Provincia." // Sin título
        images={[]} // Sin imágenes
      />
    </div>
  )
}

export default Institucional

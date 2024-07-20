// src/routes/Home/Home.jsx
import './Home.css'
import buildingImage from '../../assets/building.jpg' // Asegúrate de que la ruta es correcta

export const Home = () => {
  return (
    <div className="home-container">
      <div
        className="header-background"
        style={{ backgroundImage: `url(${buildingImage})` }}
      >
        <div className="overlay">
          <h2>PATRIMONIO HISTÓRICO Y CULTURAL</h2>
        </div>
      </div>

      <div className="card">
        <h3>Sobre el Archivo Histórico</h3>
        <p>
          El Archivo Histórico de la provincia de Santiago del Estero fue creado
          el 5 de febrero de 2008, mediante Decreto Nº 110/08, como un
          desprendimiento del Archivo General de la provincia. Contiene toda la
          documentación anterior al año 1900. Su objetivo principal es ser una
          fuente de información para aquellos interesados en conocer la historia
          de Santiago del Estero.
        </p>
      </div>

      <div className="card">
        <h3>Evolución del Archivo</h3>
        <p>
          El Archivo Histórico se creó a partir de la Sección Documentos
          históricos del Archivo General de la provincia, que databa del año
          1941, y conserva todos los documentos anteriores a 1900.
        </p>
        <ul>
          <li>Expedientes judiciales civiles y criminales</li>
          <li>Protocolos notariales</li>
          <li>Documentos públicos y privados</li>
          <li>Correspondencias</li>
          <li>Leyes y decretos</li>
          <li>Tierras fiscales</li>
          <li>Documentos coloniales</li>
          <li>Expedientes de gobierno</li>
          <li>Diarios, libros y boletines</li>
        </ul>
      </div>

      <div className="card">
        <h3>Edificio</h3>
        <p>
          El Archivo Histórico, como parte del Archivo General, estuvo ubicado
          en distintas localizaciones.
        </p>
        <p>
          El Archivo de Santiago del Estero es uno de los más importantes por
          ser ésta la primera ciudad fundada en territorio argentino. Al no
          tener un estatus propio, ni contar con personal especializado, fue
          expoliado a lo largo de los años, a pesar de los esfuerzos de muchas
          personas para evitarlo. Entre la documentación desaparecida se
          encuentra el Acta fundacional de la ciudad, de la que hace
          relativamente poco pudo encontrarse copia en el Archivo de Sucre,
          Bolivia.
        </p>
        <p>
          Desde su creación en 2008, se encuentran abocados a la recuperación de
          toda la documentación histórica. Se confeccionaron los índices, se
          preservan los documentos con criterios archivísticos y de
          conservación. Entre los documentos más valiosos se encuentran el Acta
          de la Autonomía, las primeras Constituciones provinciales manuscritas
          y la documentación del período colonial, desde 1554, que se
          sistematizó y editó en varios tomos.
        </p>
      </div>

      <div className="card">
        <h3>Ubicación actual</h3>
        <p>
          En el año 2014 el gobierno de la provincia adquirió la propiedad que
          fuera la casa de Dn Andrés Chazarreta para el funcionamiento de
          Archivo Histórico, preservando las dos salas donde funcionaba el Museo
          Chazarreta. Tras las reformas y construcciones pertinentes se inauguró
          en agosto de 2021.
        </p>
      </div>
    </div>
  )
}

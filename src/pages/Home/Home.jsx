// src/pages/Home/Home.jsx
import React from 'react';
import './Home.css';
import buildingImage from '../../assets/building.jpg'; 
import acercaImg from '../../assets/almacen-AH.jpg';
import evolucionImg from '../../assets/hoja-AH.jpg';
import ubicacionImg from '../../assets/inaguracion-AH.jpg';

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
        <p>
          "Un archivo con fondos no organizados y no descritos, es un archivo mudo, 
          ciego, inservible, que oculta información y reduce, por no decir impide, 
          la investigación."
        </p>
      </div>

      <div className="card">
        <p>
          "La Historia no puede resolverse sin acudir a los archivos. No es suficiente un 
          conocimiento superficial o aproximado, por lo tanto es obligatorio consultar e 
          interpretar los documentos de la época del lugar que se pretende investigar."
        </p>
      </div>

      <div className="body-1">
        <img src={acercaImg} alt="Acerca de" className="body-1-img" />
        <div className="body-1-content">
          <h3>Acerca de</h3>
          <p>
El Archivo Histórico de Santiago del Estero se creó para organizar, 
custodiar y poner a disposición del público documentos históricos. El edificio, 
ubicado en la calle Mitre 127, tiene un hall de entrada, sala de investigadores, 
depósito de 140 m2, oficinas y un patio cercano al depósito.
          </p>
        </div>
      </div>

      <div className="body-2">
        <img src={evolucionImg} alt="Evolución" className="body-2-img" />
        <div className="body-2-content">
          <h3>Evolución</h3>
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
      </div>

      <div className="body-3">
        <img src={ubicacionImg} alt="Ubicación actual" className="body-3-img" />
        <div className="body-3-content">
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
    </div>
  );
};

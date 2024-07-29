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
    </div>
  );
};

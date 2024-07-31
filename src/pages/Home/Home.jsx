// src/pages/Home/Home.jsx
import React from 'react'
import './Home.css'
import buildingImage from '../../assets/building.jpg'

export const Home = () => {
  return (
    <>
      <div
        className="header-background"
        style={{ backgroundImage: `url(${buildingImage})` }}
      >
        <div className="overlay">
          <h1>PATRIMONIO HISTÓRICO Y CULTURAL</h1>
        </div>
      </div>
      <div className="home-container">
        <div className="card">
          <blockquote>
            &ldquo;Un archivo con fondos no organizados y no descritos, es un
            archivo mudo, ciego, inservible, que oculta información y reduce,
            por no decir impide, la investigación.&rdquo;
          </blockquote>
        </div>

        <div className="card">
          <blockquote>
            &ldquo;La Historia no puede resolverse sin acudir a los archivos. No
            es suficiente un conocimiento superficial o aproximado, por lo tanto
            es obligatorio consultar e interpretar los documentos de la época
            del lugar que se pretende investigar.&rdquo;
          </blockquote>
        </div>
      </div>
    </>
  )
}

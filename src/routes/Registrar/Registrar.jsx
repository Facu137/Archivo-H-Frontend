import React, { useState } from "react";
import "./Registrar.css";
import axios from "axios";

export const Registrar = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        formData
      );
      if (response.status === 201) {
        console.log("Usuario registrado con éxito", response.data);
        window.location.href = "/login";
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(
          error.response.data.message || "Hubo un error al registrar el usuario"
        );
      } else {
        setError("Hubo un error al registrar el usuario");
      }
      console.error("Error al registrar el usuario", error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Registrar Usuario</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="register-form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            required
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Registrar</button>
        <div className="register-login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </div>
      </form>
    </div>
  );
};

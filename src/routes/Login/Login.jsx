import React, { useState } from 'react';
import './Login.css';
import axios from 'axios'; // Si decides usar axios

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        // Aquí puedes guardar el token en el localStorage o en un contexto de React
        localStorage.setItem('token', token);
        // Redirigir al usuario a la página principal o a donde necesites
        window.location.href = '/cuenta';
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Correo o contraseña incorrectos');
      } else {
        setError('Hubo un error al intentar iniciar sesión');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};
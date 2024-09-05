import React from 'react';
import './Button.css'; // Importa tu archivo CSS
function Button({ children, onClick, variant }) {
  const theme = useTheme(); // Hook personalizado o contexto para obtener el tema actual
  return (
    <button 
      type="button" 
      onClick={onClick}
      className={`button ${variant} ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}
    >
      {children}
    </button>
  );
}
export default Button;
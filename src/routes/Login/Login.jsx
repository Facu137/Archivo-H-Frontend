import './Login.css';

export const Login = () => {
  return (
    <form>
      <div>
        <label htmlFor="exampleInputEmail1">
          Correo
        </label>
        <input
          type="email"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
        />
      </div>
      <div>
        <label htmlFor="exampleInputPassword1">
          Contraseña
        </label>
        <input
          type="password"
          id="exampleInputPassword1"
        />
      </div>

      <button type="submit">
        Iniciar Sesion
      </button>
    </form>
  );
};

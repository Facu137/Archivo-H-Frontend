import './Login.css';

export const Login = () => {
  return (
<div class="wrapper">
      <span class="icon-close">
        <ion-icon name="close-outline">
          X
        </ion-icon></span>

      <div class="form-box login">
        <h2>Iniciar Sesion</h2>
        <form action="#">
          <div class="input-box">
            <span class="icon"><ion-icon name="mail"></ion-icon></span>
            <input type="email" required />
            <label>Correo</label>
          </div>
          <div class="input-box">
            <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
            <input type="Contraseña" required />
            <label>Contraseña</label>
          </div>
          <div class="remember-forgot">
            <label
              ><input type="checkbox" />
              Recuerdame
            </label>
            <a href="#">Olvide mi contraseña</a>
          </div>

          <button type="submit" class="btn">ingresar</button>
          <div class="login-register">
            <p>
              No tienes una cuenta?
              <a href="#" class="register-link">Registrate</a>
            </p>
          </div>
        </form>
      </div>

      <div class="form-box register">
        <h2>Registrate</h2>
        <form action="#">
          <div class="input-box">
            <span class="icon"><ion-icon name="person"></ion-icon></span>
            <input type="text" required />
            <label>Nombre de usuario</label>
          </div>
          <div class="input-box">
            <span class="icon"><ion-icon name="mail"></ion-icon></span>
            <input type="email" required />
            <label>Correo</label>
          </div>
          <div class="input-box">
            <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
            <input type="Contraseña" required />
            <label>Contraseña</label>
          </div>
          <div class="remember-forgot">
            <label
              ><input type="checkbox" />
              Acepto los terminos y condiciones
            </label>
          </div>
          <button type="submit" class="btn">Registrarse</button>
          <div class="login-register">
            <p>
              ya tienes una cuenta? <a href="#" class="login-link">ingresa</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

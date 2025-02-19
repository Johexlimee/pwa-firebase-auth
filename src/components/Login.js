// Importa la función `useTranslation` de `react-i18next` para manejar la traducción de textos
import { useTranslation } from "react-i18next";

// Importa la función `changeLanguage` del archivo de configuración `i18n` para cambiar el idioma dinámicamente
import { changeLanguage } from "../i18n";

// Importa las funciones de autenticación desde el archivo `firebase.js`
import { auth, loginWithGoogle, registerWithEmail, loginWithEmail, logout } from "../firebase";

// Importa `useAuthState` de `react-firebase-hooks/auth` para obtener el estado de autenticación del usuario
import { useAuthState } from "react-firebase-hooks/auth";

// Importa `useState` de React para manejar el estado de los inputs y errores
import { useState } from "react";

// Importa Bootstrap para aplicar estilos predefinidos
import "bootstrap/dist/css/bootstrap.min.css";

// Define el componente `Login`
const Login = () => {
  // Obtiene la función de traducción `t` y el objeto de configuración `i18n`
  const { t, i18n } = useTranslation();

  // Obtiene el estado del usuario autenticado (si hay uno)
  const [user] = useAuthState(auth);

  // Define los estados para manejar el email, contraseña y errores
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  // Maneja el evento de autenticación (registro o inicio de sesión)
  const handleAuth = async (e) => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario
    setError(null); // Reinicia el estado de error

    try {
      if (isRegistering) {
        // Si el usuario está en modo registro, intenta registrar con email y contraseña
        await registerWithEmail(email, password);
      } else {
        // Si no, intenta iniciar sesión con email y contraseña
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message); // Captura cualquier error y lo almacena en el estado
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card shadow-lg p-4 text-center" style={{ maxWidth: "400px" }}>
        <h2 className="mb-3 text-primary">{t("welcome")}</h2>

        {/* Selector de idioma con Bootstrap */}
        <div className="btn-group mb-3">
          <button onClick={() => changeLanguage("en")} className={`btn ${i18n.language === "en" ? "btn-primary" : "btn-outline-secondary"}`}>🇬🇧 EN</button>
          <button onClick={() => changeLanguage("es")} className={`btn ${i18n.language === "es" ? "btn-primary" : "btn-outline-secondary"}`}>🇪🇸 ES</button>
          <button onClick={() => changeLanguage("fr")} className={`btn ${i18n.language === "fr" ? "btn-primary" : "btn-outline-secondary"}`}>🇫🇷 FR</button>
        </div>

        {user ? (
          <>
            {/* Si el usuario está autenticado, muestra su nombre y un botón para cerrar sesión */}
            <p className="mb-3 font-weight-bold">{user.displayName || user.email}</p>
            <button onClick={logout} className="btn btn-danger">{t("logout")}</button>
          </>
        ) : (
          <form onSubmit={handleAuth}>
            {/* Campo de entrada para el email */}
            <div className="mb-3">
              <input type="email" placeholder={t("email")} className="form-control" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {/* Campo de entrada para la contraseña */}
            <div className="mb-3">
              <input type="password" placeholder={t("password")} className="form-control" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {/* Mensaje de error en caso de que ocurra un fallo en la autenticación */}
            {error && <p className="text-danger">{error}</p>}
            {/* Botón para iniciar sesión o registrarse */}
            <button type="submit" className="btn btn-success w-100" disabled={user}>
              {isRegistering ? t("register") : t("signIn")}
            </button>
            {/* Botón para alternar entre modo inicio de sesión y registro */}
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="btn btn-link">
              {isRegistering ? t("signIn") : t("register")}
            </button>
          </form>
        )}

        {/* Botón para iniciar sesión con Google */}
        <button onClick={loginWithGoogle} className="btn btn-dark mt-3 w-100" disabled={user}>
          {t("signInWithGoogle")}
        </button>
        <button onClick={loginWithGoogle} className="btn btn-dark mt-3 w-100" disabled={user}>
          {t("signInWithGoogle")}
        </button>
      </div>
    </div>
  );
};

// Exporta el componente `Login` para su uso en otras partes de la aplicación
export default Login;

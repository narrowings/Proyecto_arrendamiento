import React, { useState } from "react";
import "../login.css";
import imagenLogin1 from "../assets/imagenLogin1.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { iniciarSesion, iniciarSesionConGoogle } from "../services/usuarioService";
import { decodeJwt, saveToken } from "../utils/jwt";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ nombreUsuario: "", contrasena: "" });
  const [error, setError] = useState("");

  const handleSuccess = async (response) => {
    if (response?.credential) {
      const googleToken = response.credential;
      console.log("→ [FRONT] Google credential:", googleToken);
      try {
        const res = await iniciarSesionConGoogle(googleToken);
        const { token } = res.data;

        saveToken(token);
        const userData = decodeJwt(token);
        console.log("Google login payload:", userData);


        if (userData.rol == "Interesado") {
          navigate("/home3");
        } else if (userData.rol == "Propietario") {
          navigate("/home2");
        } else if (userData.rol === "Administrador") {
          navigate("/Administrador");
        } else {
          navigate("/selectRole");
        }
      } catch (err) {
        console.error("Error al iniciar sesión con Google desde el backend:", err);
        setError("No se pudo autenticar con Google");
      }
    }
  };

  const handleFailure = () => {
    console.error("Error al iniciar sesión con Google");
    setError("No se pudo iniciar sesión con Google");
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await iniciarSesion(formData);
      const { token } = res.data;
      console.log("JWT backend:", token);

      saveToken(token);
      const payload = decodeJwt(token);
      console.log("Payload del JWT:", payload);

      if (payload.rol == "Interesado") {
        navigate("/home3");
      } else if (payload.rol == "Propietario") {
        navigate("/home2");
      } else if (payload.rol === "Administrador") {
+       navigate("/Administrador");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      const resp = err.response?.data;
      let mensaje = "Usuario o contraseña incorrectos.";
      if (typeof resp === "string") mensaje = resp;
      else if (typeof resp === "object") {
        mensaje = resp.error || resp.message || JSON.stringify(resp);
      }
      setError(mensaje);
    }
  };

  return (
    <div className="login-container">
      <section className="login-left">
        <div className="title-container">
          <h1>Encuentra el lugar de tus sueños</h1>
        </div>
        <div className="description-container">
          <p>Explora cientos de opciones y encuentra tu próximo hogar en minutos.</p>
        </div>

        <p className="login-label">Ingresa con tu cuenta</p>
        <div className="google-btn">
          <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombreUsuario">Usuario</label>
            <input
              type="text"
              id="nombreUsuario"
              name="nombreUsuario"
              required
              value={formData.nombreUsuario}
              onChange={handleChange}
            />
          </div>

          <div className="form-group contrasena-group">
            <label htmlFor="contrasena">Contraseña</label>
            <div className="contrasena-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="contrasena"
                name="contrasena"
                required
                value={formData.contrasena}
                onChange={handleChange}
              />
              <span
                className="toggle-contrasena"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
        
          {error && <p className="error-text">{error}</p>}

          <div className="helper-links">
            <Link to="/forgotPassword">¿Olvidaste tu contraseña?</Link>
            <div className="remember-me">
              <input type="checkbox" id="recordarme" />
              <label htmlFor="recordarme">Recordarme</label>
            </div>
          </div>


          <button type="submit" className="login-btn">
            Entra
          </button>

          <div className="register-section">
            <span>¿No tienes una cuenta?</span>
            <Link to="/signup">Regístrate</Link>
          </div>
        </form>
      </section>

      <section className="login-right">
        <img src={imagenLogin1} alt="Imagen de login" className="login-image" />
      </section>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import "../SignUp.css";
import { useNavigate } from "react-router-dom";
import imagenRegister1 from "../assets/imagenRegister1.jpg";
import { Eye, EyeOff } from "lucide-react";
import { registrarUsuario } from "../services/usuarioService";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rol: "",
    nombreUsuario: "",
    telefono: "",
    email: "",
    contrasena: "",
    confirmPassword: "",
    palabraSecreta: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (contrasena) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]{8,}$/;
    return regex.test(contrasena);
  };
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (telefono) => /^\d{10}$/.test(telefono);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { rol, nombreUsuario, telefono, email, contrasena, confirmPassword, palabraSecreta } = formData;

    if (!validateEmail(email)) {
      setError("El email no es válido.");
      return;
    }
    if (!validatePhone(telefono)) {
      setError("El teléfono debe tener exactamente 10 dígitos numéricos.");
      return;
    }
    if (!validatePassword(contrasena)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }
    if (contrasena !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const userData = { rol, nombreUsuario, telefono, email, contrasena, palabraSecreta };

    try {
      await registrarUsuario(userData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrar el usuario.");
      console.error("Error al registrar:", err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <h1>Crea tu cuenta y encuentra tu hogar ideal</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* ROL */}
          <div className="form-group">
            <label htmlFor="rol">Rol</label>
            <select id="rol" name="rol" required value={formData.rol} onChange={handleChange}>
              <option value="">Selecciona un rol</option>
              <option value="Propietario">Propietario</option>
              <option value="Interesado">Interesado</option>
            </select>
          </div>

          {/* USUARIO */}
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

          {/* TELEFONO */}
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              required
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* CONTRASEÑA */}
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
              <span className="toggle-contrasena" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="form-group contrasena-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="contrasena-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span className="toggle-contrasena" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          {/* PALABRA SECRETA */}
          <p className="info-text">Agrega una palabra secreta para más seguridad</p>
          <div className="form-group">
            <label htmlFor="palabraSecreta">Palabra Secreta</label>
            <input
              type="text"
              id="palabraSecreta"
              name="palabraSecreta"
              required
              value={formData.palabraSecreta}
              onChange={handleChange}
            />
          </div>
          <p className="warning-text">
            Esta palabra te ayudará a recuperar tu cuenta en caso de olvidar tu contraseña. Asegúrate de recordarla bien.
          </p>

          {error && <p className="error-text">{error}</p>}
          <button type="submit">Registrar</button>
        </form>
      </div>
      <div className="signup-right"></div>
      <img src={imagenRegister1} alt="Registro" className="signup-image" />
    </div>
  );
};

export default SignUp;
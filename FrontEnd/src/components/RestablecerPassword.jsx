// src/components/RestablecerPassword.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import "../restablecerPassword.css";
import imagenRecuperacion from "../assets/imagenRecuperacion.jpg";

const RestablecerPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [estado, setEstado] = useState('cargando'); // 'cargando' | 'ok' | 'error'
  const [mensaje, setMensaje] = useState('');
  const [formError, setFormError] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (!token) {
      setEstado('error');
      setMensaje('Token no proporcionado.');
      return;
    }

    axios
      .get(`http://localhost:8080/space/usuarios/restablecer`, {
        params: { token }
      })
      .then(res => {
        setEstado('ok');
        setMensaje(res.data);
      })
      .catch(err => {
        setEstado('error');
        setMensaje(err.response?.data || 'Token inválido o expirado.');
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (newPass.length < 8) {
      setFormError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/space/usuarios/restablecer`,
        null,
        { params: { token, nuevaContrasena: newPass } }
      );
      alert('✅ Contraseña restablecida. Por favor inicia sesión.');
      navigate('/login');
    } catch (err) {
      setFormError(
        err.response?.data?.error ||
        'Error al restablecer la contraseña.'
      );
    }
  };

  if (estado === 'cargando' || estado === 'error') {
    return (
      <div className="recuperar-palabra-container">
        <div className="recuperar-palabra-left">
          <h1>{estado === 'cargando' ? 'Verificando token…' : '❌ Error'}</h1>
          <p>{mensaje}</p>
        </div>
        <div className="recuperar-palabra-right">
          <img src={imagenRecuperacion} alt="Recuperación" className="imagen-recuperacion" />
        </div>
      </div>
    );
  }

  return (
    <div className="recuperar-palabra-container">
      <div className="recuperar-palabra-left">
        <div className="title-container">
          <h1>Restablecer contraseña</h1>
        </div>
        <div className="description-container">
          <p>{mensaje}</p>
        </div>
        <form onSubmit={handleSubmit} className="form-group">

          <label>Nueva contraseña</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-40%)",
                cursor: "pointer",
                color: "#000000"
              }}
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <label>Confirmar contraseña</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPass ? 'text' : 'password'}
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              required
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-40%)",
                cursor: "pointer",
                color: "#000000"
              }}
            >
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {formError && <p className="error-text">{formError}</p>}

          <button type="submit">Restablecer</button>
        </form>
      </div>
      <div className="recuperar-palabra-right">
        <img src={imagenRecuperacion} alt="Recuperación" className="imagen-recuperacion" />
      </div>
    </div>
  );
};

export default RestablecerPassword;

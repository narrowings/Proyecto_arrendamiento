// src/components/CalificarAcuerdo.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerAcuerdo, calificarAcuerdo } from '../services/acuerdoArrendamientoService';
import { getToken, decodeJwt } from '../utils/jwt';
import HeaderPropietario from './HeaderPropietario';
import HeaderInteresado from './HeaderInteresado';
import '../CalificarAcuerdo.css';

const CalificarAcuerdo = () => {
  const { idAcuerdo } = useParams();
  const navigate = useNavigate();
  const [acuerdo, setAcuerdo] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [mensaje, setMensaje] = useState('');

  const token = getToken();
  const decoded = token ? decodeJwt(token) : {};
  const isPropietario = decoded.rol === 'Propietario';
  const Header = isPropietario ? HeaderPropietario : HeaderInteresado;

  useEffect(() => {
    obtenerAcuerdo(idAcuerdo)
      .then(setAcuerdo)
      .catch(() => setMensaje('❌ No se pudo cargar el acuerdo.'));
  }, [idAcuerdo]);

  if (!acuerdo) return <p>Cargando...</p>;

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updates = isPropietario
        ? { calificacionUsuario: rating, comentarioUsuario: comment }
        : { calificacionEspacio: rating, comentarioEspacio: comment };

      await calificarAcuerdo(idAcuerdo, updates);
      alert('¡Calificación enviada!');
      navigate('/acuerdos');
    } catch {
      setMensaje('❌ Error al enviar la calificación.');
    }
  };

  return (
    <>
      <Header />
      <div className="calificar-container">
        <h1>
          {isPropietario
            ? 'CALIFICA LA EXPERIENCIA CON EL ARRENDATARIO'
            : 'CALIFICA LA EXPERIENCIA CON EL ESPACIO'}
        </h1>
        <p>
          {isPropietario
            ? `Arrendatario: ${acuerdo.idUsuarios.nombreUsuario}`
            : `Espacio: ${acuerdo.idEspacios.titulo}`}
        </p>

        <form onSubmit={handleSubmit} className="calificar-form">
          <div className="stars">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                className={(hover || rating) >= star ? 'on' : 'off'}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            placeholder="Comentarios adicionales"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />

          <button type="submit" className="btn-enviar">Enviar</button>
          {mensaje && <p className="error">{mensaje}</p>}
        </form>
      </div>
    </>
  );
};

export default CalificarAcuerdo;

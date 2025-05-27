// src/components/Conversaciones.jsx
import React, { useEffect, useState } from "react";
import { Link }                       from "react-router-dom";
import { getToken, decodeJwt }        from "../utils/jwt";
import conversacionService            from "../services/conversacionService";
import "../Conversaciones.css";

const Conversaciones = () => {
  const [lista, setLista]       = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const decoded       = decodeJwt(token);
    const idUsuario     = decoded.idUsuarios;
    const esPropietario = decoded.rol === "Propietario";

    const promesa = esPropietario
      ? conversacionService.obtenerConversacionesPorDuenio(idUsuario)
      : conversacionService.obtenerConversacionesPorUsuario(idUsuario);

    promesa
      .then(data => {
        setLista(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar conversaciones", err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div>Cargando conversaciones…</div>;
  }

  if (!Array.isArray(lista)) {
    console.error("La respuesta de conversaciones no es un arreglo:", lista);
    return <div>Error al cargar conversaciones.</div>;
  }

  if (lista.length === 0) {
    return <div>No tienes conversaciones activas.</div>;
  }

  const decoded = decodeJwt(getToken());
  const miId    = decoded.idUsuarios;
  const esProp  = decoded.rol === "Propietario";

  return (
    <div className="conversaciones-container">
      {lista.map(conv => {
        // Título del aviso
        const tituloAviso = conv.aviso.titulo;

        // Determinar interlocutor: si soy propietario, es quien inició la conversación;
        // si soy interesado, es el propietario del espacio del aviso
        const interesado  = conv.usuarioInteresado;
        const propietario = conv.aviso.idEspacios.usuario;
        const otro = esProp ? interesado : propietario;

        const nombre = otro?.nombreUsuario || "Desconocido";
        const foto   = otro?.fotoPerfil?.trim() ? otro.fotoPerfil : "/usuario.png";

        return (
          <Link
            key={conv.idConversacion}
            to={`/mensajes/${conv.idConversacion}`}
            className="conversacion-item"
          >
            <div className="conversacion-info">
              <strong>AVISO: {tituloAviso}</strong>
              <div className="interlocutor">
                <img
                  src={foto}
                  alt={nombre}
                  className="conversacion-avatar"
                />
                <span className="conversacion-name">{nombre}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Conversaciones;

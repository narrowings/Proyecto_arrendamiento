// src/components/ChatConversacion.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams }                   from "react-router-dom";
import { Client }                      from "@stomp/stompjs";
import SockJS                          from "sockjs-client";
import { getToken, decodeJwt }         from "../utils/jwt";
import "../ChatConversacion.css";

// Convierte el valor de "creado" de tu backend a un Date de JS:
// - Arrays directos [2025,5,24,...]
// - Cadenas que representan arrays "[2025,5,24,...]\u0000"
// - ISO-strings o timestamps numéricos
function parseJavaTime(value) {
  let arr = value;

  // 1) Si viene como string de array "[...]\u0000", limpiamos y parseamos
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const cleaned = value.replace(/\u0000/g, "");
      arr = JSON.parse(cleaned);
    } catch (e) {
      console.warn("No pude parsear array de fecha:", value, e);
      arr = value;
    }
  }

  // 2) Si ahora es un array, construimos el Date
  if (Array.isArray(arr)) {
    const [year, month, day, hour, minute, second, nano] = arr;
    const ms = Math.floor((nano || 0) / 1e6);
    return new Date(year, month - 1, day, hour, minute, second, ms);
  }

  // 3) Fallback: ISO-string o timestamp numérico
  return new Date(arr);
}

const ChatConversacion = () => {
  const { idConversacion }               = useParams();
  const [mensajes, setMensajes]         = useState([]);
  const [interlocutor, setInterlocutor] = useState(null);
  const clientRef                        = useRef(null);

  useEffect(() => {
    const token   = getToken();
    const decoded = decodeJwt(token);
    const miId    = decoded.idUsuarios;

    // 1) Cargo la conversación completa
    fetch(`http://127.0.0.1:8080/space/conversacion/${idConversacion}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(conv => {
        setMensajes(conv.mensajes || []);

        // Determinar quién es “el otro”
        const interesado  = conv.usuarioInteresado;
        const propietario = conv.aviso.idEspacios.usuario;
        const otro = (miId === interesado.idUsuarios)
          ? propietario
          : interesado;

        if (otro) {
          setInterlocutor({
            nombre: otro.nombreUsuario,
            foto:   otro.fotoPerfil?.trim() ? otro.fotoPerfil : "/usuario.png"
          });
        } else {
          console.error("Interlocutor no encontrado en:", conv);
        }
      });

    // 2) Conectar WebSocket STOMP
    const client = new Client({
      webSocketFactory: () => new SockJS("http://127.0.0.1:8080/ws-chat"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(
        `/topic/conversacion/${idConversacion}`,
        msg => {
          setMensajes(prev => [...prev, JSON.parse(msg.body)]);
        }
      );
    };

    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [idConversacion]);

  const enviarMensaje = e => {
    e.preventDefault();
    const contenido = e.target.mensaje.value;
    const idUsuario = decodeJwt(getToken()).idUsuarios;
    clientRef.current.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify({ idConversacion: +idConversacion, idUsuario, contenido })
    });
    e.target.mensaje.value = "";
  };

  return (
    <div className="chat-container">
      {/* Header con interlocutor */}
      {interlocutor && (
        <div className="chat-header">
          <img
            src={interlocutor.foto}
            alt="avatar"
            className="chat-header-avatar"
          />
          <span className="chat-header-name">
            {interlocutor.nombre}
          </span>
        </div>
      )}

      <div className="mensajes-list">
        {mensajes.map(m => {
          const fecha = parseJavaTime(m.creado);
          const hora  = fecha.toLocaleTimeString(undefined, {
                          hour:   "2-digit",
                          minute: "2-digit",
                          hour12: true
                        });
          const esMio = m.usuario.idUsuarios === decodeJwt(getToken()).idUsuarios;
          return (
            <div
              key={m.idMensaje}
              className={esMio ? "mi-mensaje" : "otro-mensaje"}
            >
              <span>{m.contenido}</span>
              <small>{hora}</small>
            </div>
          );
        })}
      </div>

      <form onSubmit={enviarMensaje} className="chat-form">
        <input name="mensaje" placeholder="Escribe…" required />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ChatConversacion;

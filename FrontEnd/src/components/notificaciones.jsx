import React, { useState, useEffect } from 'react';
import '../notificaciones.css';

const Notificaciones = ({ trigger }) => {
  const [visible, setVisible] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);

  const toggleVisible = () => {
    setVisible(!visible);
    if (!visible) {
      // Marcar como leídas cuando se abre el panel
      setNoLeidas(0);
    }
  };

  // Simulación de notificaciones (se reemplazará por API)
  const fetchNotificaciones = async () => {
    // Esta lógica será reemplazada por una llamada real al backend
    const data = [
      { id: 1, mensaje: 'Se ha publicado un nuevo aviso.', leida: false },
      { id: 2, mensaje: 'Se ha reportado un aviso en la plataforma.', leida: false },
      { id: 3, mensaje: 'Otro aviso más reciente.', leida: true },
    ];

    setNotificaciones(data);
    const cantidadNoLeidas = data.filter((n) => !n.leida).length;
    setNoLeidas(cantidadNoLeidas);
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  return (
    <div className="notificacion-container">
      <div className="trigger-wrapper" onClick={toggleVisible}>
        {trigger}
        {noLeidas > 0 && (
          <span className="contador">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </div>
      {visible && (
        <div className="notificacion-panel">
          <h4>Notificaciones</h4>
          <ul>
            {notificaciones.length > 0 ? (
              notificaciones.map((n) => (
                <li key={n.id} className={`notificacion-item ${n.leida ? 'leida' : 'no-leida'}`}>
                  {n.mensaje}
                </li>
              ))
            ) : (
              <li className="no-notificaciones">No hay notificaciones</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;

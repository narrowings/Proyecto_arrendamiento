import React, { useState, useEffect } from 'react';
import { Bell, TriangleAlert, UserRound } from 'lucide-react';
import '../administrador.css';
import BuscarAvisos from './BuscarAvisos';
import { Link } from 'react-router-dom';
import ListarUsuarios from './listarUsuarios';
import denunciasService from '../services/denunciasService';
import Notificaciones from './notificaciones';
import GestionAvisoAdmin from './gestionAvisoAdmin';

const Administrador = () => {
  const [vista, setVista] = useState('avisosReportados');
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (vista === 'avisosReportados') {
      setCargando(true);
      denunciasService.listarDenuncias()
        .then(data => {
          console.log("Denuncias recibidas:", data);
          setDenuncias(data);
        })
        .catch(err => console.error("Error al cargar denuncias:", err))
        .finally(() => setCargando(false));
    }
  }, [vista]);

  // Helper para convertir tu array [yyyy, M, d, h, m, s] a Date
  const parseFecha = arr =>
    arr && Array.isArray(arr)
      ? new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5])
      : null;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>
          <Link
            to="/Administrador"
            onClick={() => setVista('avisosReportados')}
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
            }}
          >
            PANEL DE CONTROL
          </Link>
        </h2>
        <div className="admin-actions">
          <Notificaciones
          trigger={
            <button className="notificaciones-btn">
              <Bell />
            </button>
            }
          />
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="cerrar-sesion">Cerrar sesión</button>
          </Link>
        </div>
      </header>

      <div className="admin-controls">
        <div className="admin-buttons">
          <button
            className={`control-btn ${vista === 'avisosPublicados' ? 'active' : ''}`}
            onClick={() => setVista('avisosPublicados')}
          >
            Avisos Publicados
          </button>

          <button
            className={`control-btn ${vista === 'avisosReportados' ? 'active' : ''}`}
            onClick={() => setVista('avisosReportados')}
          >
            <TriangleAlert size={20} /> Avisos reportados
          </button>

          <button
            className={`control-btn ${vista === 'usuarios' ? 'active' : ''}`}
            onClick={() => setVista('usuarios')}
          >
            <UserRound /> Usuarios
          </button>
        </div>
      </div>

      <div className="tabla-contenedor">
        {vista === 'avisosPublicados' && (
          <>
            <h3>Avisos Publicados</h3>
            <GestionAvisoAdmin />
          </>
        )}

        {vista === 'avisosReportados' && (
          <>
            <h3>Avisos reportados</h3>
            {cargando ? (
              <p>Cargando denuncias...</p>
            ) : (
              <table className="tabla-reportes">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título del Aviso</th>
                    <th>Fecha</th>
                    <th>Usuario</th>
                    <th>Motivo</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {denuncias.length > 0 ? (
                    denuncias.map((d, i) => {
                      const fecha = parseFecha(d.creado);
                      return (
                        <tr key={d.idDenuncias}>
                          <td>{d.idDenuncias}</td>
                          <td>{d.idAvisos?.titulo || 'Sin título'}</td>
                          <td>
                            {fecha
                              ? fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString()
                              : 'Invalid Date'}
                          </td>
                          <td>{d.idUsuarios?.nombreUsuario || 'Desconocido'}</td>
                          <td>{d.razon}</td>
                          <td>{d.comentario || '-'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6">No hay denuncias registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}

        {vista === 'usuarios' && (
          <>
            <h3>Gestión de usuarios</h3>
            <ListarUsuarios />
          </>
        )}
      </div>
    </div>
  );
};

export default Administrador;

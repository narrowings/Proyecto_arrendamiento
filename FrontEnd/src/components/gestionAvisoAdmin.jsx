// src/components/GestionAvisoAdmin.jsx
import React, { useState, useEffect } from 'react';
import avisoService from '../services/avisosService';

const GestionAvisoAdmin = () => {
  const [avisos, setAvisos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    avisoService.listarTodos()
      .then(data => {
        setAvisos(data);
        console.log(data)
        setCargando(false);
      })
      .catch(err => {
        setError('Error al cargar los avisos');
        console.error(err);
        setCargando(false);
      });
  }, []);

  const eliminarAviso = async (idAviso) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este aviso?')) {
      try {
        await avisoService.eliminarAviso(idAviso);
        setAvisos(prev => prev.filter(a => a.idAvisos !== idAviso));
      } catch (err) {
        alert('Error al eliminar el aviso');
        console.error(err);
      }
    }
  };

  if (cargando) return <p>Cargando avisos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <table className="tabla-reportes">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descripcion</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {avisos.length > 0 ? (
          avisos.map(aviso => (
            <tr key={aviso.idAvisos}>
              <td>{aviso.idAvisos}</td>
              <td>{aviso.titulo}</td>
              <td>{aviso.descripcion}</td>
              <td>{aviso.estado}</td>
              <td>
                <button className="btn-eliminar" onClick={() => eliminarAviso(aviso.idAvisos)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No hay avisos disponibles.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default GestionAvisoAdmin;

import React, { useEffect, useState } from 'react';
import { listarUsuarios } from '../services/usuarioService';
import '../listarUsuarios.css'; // 👈 Importación del CSS

const ListarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch(err => console.error('Error al obtener usuarios:', err));
  }, []);

  return (
    <div className="listar-usuarios-container">
      <h2 className="listar-usuarios-title">Lista de usuarios</h2>
      <table className="listar-usuarios-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="4" className="sin-usuarios">No hay usuarios disponibles</td>
            </tr>
          ) : (
            usuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.idUsuarios}</td>
                <td>{usuario.nombreUsuario}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarUsuarios;

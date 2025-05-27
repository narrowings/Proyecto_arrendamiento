// src/services/acuerdoArrendamientoService.js

import axios from 'axios';
import { getToken } from '../utils/jwt';

const API_URL = 'http://localhost:8080/space/acuerdoArrendamiento';

// helper para Authorization
const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const registrarAcuerdo = async (acuerdoObj, contratoPdf) => {
  const formData = new FormData();
  formData.append('acuerdoArrendamiento', JSON.stringify(acuerdoObj));
  formData.append('contratoPdf', contratoPdf);

  const resp = await axios.post(
    `${API_URL}/registrar`,
    formData,
    {
      ...authHeader(),
      headers: {
        ...authHeader().headers,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return resp.data;
};

export const listarAcuerdos = async () => {
  const resp = await axios.get(
    `${API_URL}/listar`,
    authHeader()
  );
  return resp.data;
};

export const descargarAcuerdo = async (id) => {
  const resp = await axios.get(
    `${API_URL}/descargar/${id}`,
    {
      ...authHeader(),
      responseType: 'blob'
    }
  );
  const blob = new Blob([resp.data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `acuerdo_${id}.pdf`;
  link.click();
};

export const obtenerAcuerdo = async (id) => {
  const resp = await axios.get(
    `${API_URL}/${id}`,
    authHeader()
  );
  return resp.data;
};

export const actualizarAcuerdo = async (id, acuerdoObj, contratoPdf) => {
  const formData = new FormData();
  formData.append('acuerdoArrendamiento', JSON.stringify(acuerdoObj));
  if (contratoPdf) {
    formData.append('contratoPdf', contratoPdf);
  }

  const resp = await axios.put(
    `${API_URL}/${id}`,
    formData,
    {
      ...authHeader(),
      headers: {
        ...authHeader().headers,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return resp.data;
};

/**
 * 6) Parchear solo las calificaciones/comentarios (PATCH + JSON + JWT)
 *
 * `updates` debe ser un objeto con alguna de estas propiedades:
 *   - calificacionEspacio: number
 *   - comentarioEspacio:   string
 *   - calificacionUsuario: number
 *   - comentarioUsuario:   string
 */
export const calificarAcuerdo = async (id, updates) => {
  const resp = await axios.patch(
    `${API_URL}/${id}/calificar`,
    updates,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return resp.data;
};

export default {
  registrarAcuerdo,
  listarAcuerdos,
  descargarAcuerdo,
  obtenerAcuerdo,
  actualizarAcuerdo,
  calificarAcuerdo
};

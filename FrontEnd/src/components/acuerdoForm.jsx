import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrarAcuerdo } from '../services/acuerdoArrendamientoService';
import conversacionService from '../services/conversacionService';
import '../acuerdoform.css';
import { getToken, decodeJwt } from '../utils/jwt';
import HeaderPropietario from './HeaderPropietario';

const AcuerdoForm = () => {
  const { idEspacios } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idEspacios,
    idUsuarios: '',
    fechaInicio: '',
    fechaFin: '',
    calificacionEspacio: '',
    comentarioEspacio: '',
    calificacionUsuario: '',
    comentarioUsuario: ''
  });
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarInteresados = async () => {
      try {
        const token = getToken();
        const dec = decodeJwt(token);
        // trae solo conversaciones donde soy dueño de ese aviso
        const convs = await conversacionService.obtenerConversacionesPorDuenio(dec.idUsuarios);
        // filtrar por espacio
        const mapUsuarios = new Map();
        convs.forEach(c => {
          if (c.aviso.idEspacios.idEspacios.toString() === idEspacios) {
            const u = c.usuarioInteresado;
            mapUsuarios.set(u.idUsuarios, u);
          }
        });
        setUsuarios(Array.from(mapUsuarios.values()));
      } catch (err) {
        console.error(err);
        setMensaje('❌ Error cargando interesados.');
      }
    };
    cargarInteresados();
  }, [idEspacios]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleArchivo = e => {
    const file = e.target.files[0];
    setArchivo(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      idEspacios: { idEspacios: parseInt(formData.idEspacios) },
      idUsuarios: { idUsuarios: parseInt(formData.idUsuarios) },
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      estado: 'activo'
    };

    try {
      await registrarAcuerdo(payload, archivo);
      setMensaje('✅ Acuerdo creado.');
      navigate('/acuerdos');
    } catch (err) {
      console.error(err);
      setMensaje(`❌ ${err}`);
    }
  };

  return (
    <>
      {/* HeaderPropietario */}
      <HeaderPropietario />
    <div className="acuerdo-form-wrapper">
      <h2>Crear Acuerdo – Espacio {idEspacios}</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <div className="form-preview-container">
        <form onSubmit={handleSubmit} className="form-acuerdo">
          <label>
            Usuario interesado:
            <select
              name="idUsuarios"
              value={formData.idUsuarios}
              onChange={handleChange}
              required
            >
              <option value="">-- Selecciona --</option>
              {usuarios.map(u => (
                <option key={u.idUsuarios} value={u.idUsuarios}>
                  {u.nombreUsuario}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha inicio:
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Fecha fin:
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Contrato PDF:
            <input
              type="file"
              accept="application/pdf"
              onChange={handleArchivo}
              required
            />
          </label>

          <button type="submit" className="btn-registrar">
            Registrar Acuerdo
          </button>
        </form>

        {previewUrl && (
          <div className="pdf-preview-right">
            <h4>Vista previa del contrato</h4>
            <iframe src={previewUrl} title="PDF preview" />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AcuerdoForm;

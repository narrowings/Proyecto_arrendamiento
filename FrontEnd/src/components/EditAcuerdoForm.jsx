// src/components/EditAcuerdoForm.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }    from 'react-router-dom';
import { obtenerAcuerdo, actualizarAcuerdo } from '../services/acuerdoArrendamientoService';
import '../acuerdoform.css';
import HeaderPropietario from './HeaderPropietario';

const EditAcuerdoForm = () => {
  const { idAcuerdo } = useParams();
  const navigate       = useNavigate();
  const [data, setData]       = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mensaje, setMensaje]       = useState('');

  useEffect(() => {
    (async () => {
      try {
        const a = await obtenerAcuerdo(idAcuerdo);
        setData(a);
        if (a.contratoPdf) {
          const blob = new Blob([new Uint8Array(a.contratoPdf)], { type: 'application/pdf' });
          setPreviewUrl(URL.createObjectURL(blob));
        }
      } catch {
        setMensaje('❌ No se pudo cargar el Acuerdo.');
      }
    })();
  }, [idAcuerdo]);

  const handleChange = e => {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
  };

  const handleArchivo = e => {
    const f = e.target.files[0];
    setArchivo(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await actualizarAcuerdo(
        idAcuerdo,
        {
          ...data,
          // conservar idEspacios e idUsuarios como vienen del backend
        },
        archivo
      );
      navigate('/acuerdos');
    } catch {
      setMensaje('❌ Error actualizando el Acuerdo.');
    }
  };

  if (!data) return <p>Cargando Acuerdo…</p>;

  return (
    <>
      {/* HeaderPropietario */}
      <HeaderPropietario />
    <div className="acuerdo-form-wrapper">
      <h1>Editar Acuerdo #{idAcuerdo}</h1>
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <div className="form-preview-container">
        <form onSubmit={handleSubmit} className="form-acuerdo">
          <p><strong>Espacio:</strong> {data.idEspacios.titulo}</p>
          <p><strong>Interesado:</strong> {data.idUsuarios.nombreUsuario}</p>

          <label>
            Fecha inicio:
            <input
              type="date"
              name="fechaInicio"
              value={data.fechaInicio}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Fecha fin:
            <input
              type="date"
              name="fechaFin"
              value={data.fechaFin}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Estado:
            <select
              name="estado"
              value={data.estado}
              onChange={handleChange}
              required
            >
              <option value="activo">Activo</option>
              <option value="vencido">Vencido</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </label>

          <label>
            Contrato PDF (opcional):
            <input
              type="file"
              accept="application/pdf"
              onChange={handleArchivo}
            />
          </label>

          <button type="submit" className="btn-registrar">
            Guardar Cambios
          </button>
        </form>

        {previewUrl && (
          <div className="pdf-preview-right">
            <h4>Contrato</h4>
            <iframe src={previewUrl} title="Contrato preview" />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default EditAcuerdoForm;

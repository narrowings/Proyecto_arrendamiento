import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import GiftTick from '../assets/iconosAnimados/GiftTick.json';
import '../verificarCuenta.css'

const VerificarCuenta = () => {
  const [searchParams] = useSearchParams();
  const [mensaje, setMensaje] = useState('Verificado correctamente! Ya puede cerrar esta ventana');
  const [estado, setEstado] = useState('cargando'); // 'ok' | 'error' | 'cargando'

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setEstado('ok');
      setMensaje('Token no proporcionado.');
      return;
    }

    axios.get(`http://localhost:8080/space/usuarios/verificar?token=${token}`)
      .then((res) => {
        setEstado('ok');
        setMensaje(res.data);
      })
      .catch((err) => {
        const mensajeServidor = err.response?.data || 'Error al verificar el token.';
      
        // Normaliza el mensaje para evitar problemas por mayúsculas/minúsculas
        const mensajeNormalizado = mensajeServidor.toLowerCase();
      
        if (
          mensajeNormalizado.includes('ya fue verificada') ||
          mensajeNormalizado.includes('ya está verificada') ||
          mensajeNormalizado.includes('ya esta verificada') ||
          mensajeNormalizado.includes('ya se encuentra verificada')
        ) {
          setEstado('error');
          
        } else {
          setEstado('ok');
          
        }
      });
      
  }, []);

    return (
    <div className="verificacion-container">
      <div className="verificacion-box">
        <h1>
          {estado == 'cargando' && 'Verificando tu cuenta...'}
          {estado == 'error' && '❌ Error de verificación'}
        </h1>

        {estado === 'ok' && (
          <Lottie
            animationData={GiftTick}
            loop={true}
            className="lottie-icon"
          />
        )}

        <p>{mensaje}</p>
      </div>
    </div>
  );
};

export default VerificarCuenta;

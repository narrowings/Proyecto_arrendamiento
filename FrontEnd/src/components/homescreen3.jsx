// src/components/HomeScreenInteresado.jsx
import "../App2.css";
import React, { useEffect, useState } from "react";
import imagen1 from "../assets/imagen1.jpg";
import imagen2 from "../assets/imagen2.jpg";
import imagen3 from "../assets/imagen3.jpg";
import imagen4 from "../assets/imagen4.jpg";
import casa1 from "../assets/casa1.jpg";
import casa2 from "../assets/casa2.jpg";
import casa3 from "../assets/casa3.jpg";
import casa4 from "../assets/casa4.jpg";
import casa5 from "../assets/casa5.jpg";
import casa6 from "../assets/casa6.jpg";
import { Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { decodeJwt, getToken } from "../utils/jwt";
import HeaderInteresado from "./HeaderInteresado";  // <-- Importa el HeaderInteresado

const HomeScreen3 = () => {

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const data = decodeJwt(token);
      console.log("Usuario decodificado en HomeScreen3:", data);
      setUsuario(data);
    }
  }, []);

  return (
    <>
      {/* Header para Interesado */}
      <HeaderInteresado usuario={usuario} />  {/* Usa el componente */}

      {/* Sección Principal */}
      <section className="home-screen">
        <div className="text-container">
          <h1>Encuentra Tu Lugar Ideal.</h1>
          <p>
            <strong>
              Explora propiedades únicas y califica tus experiencias.
            </strong>
          </p>
          <div className="stats">
            <span>
              +500 <strong>USUARIOS</strong>
            </span>
            <span>
              +1500 <strong>PUBLICACIONES</strong>
            </span>
            <span>
              <strong>CALIFICA Y CONTACTA</strong> <br /> SEGURIDAD GARANTIZADA
            </span>
          </div>
        </div>

        {/* Imágenes principales */}
        <div className="image-container">
          <img src={imagen1} alt="City View" />
          <img src={imagen2} alt="Living Room" />
          <img src={imagen3} alt="Luxury House" />
          <img src={imagen4} alt="Sunset" />
        </div>
      </section>

      {/* Sección de exploración de propiedades */}
      <div className="image-container-2">
        <div className="new-section">
          <h2>Explora Propiedades Disponibles</h2>
          <input type="text" placeholder="Busca por zona, tipo o precio..." />

          <div className="image-grid">
            <div className="houses-grid">
              <div className="house-item">
                <img src={casa1} alt="Casa 1" />
                <p>Casa moderna en zona residencial</p>
              </div>
              <div className="house-item">
                <img src={casa2} alt="Casa 2" />
                <p>Departamento de lujo con vista panorámica</p>
              </div>
              <div className="house-item">
                <img src={casa3} alt="Casa 3" />
                <p>Cabaña acogedora en la montaña</p>
              </div>
              <div className="house-item">
                <img src={casa4} alt="Casa 4" />
                <p>Casa campestre con amplio jardín</p>
              </div>
              <div className="house-item">
                <img src={casa5} alt="Casa 5" />
                <p>Arquitectura clásica en el corazón de la ciudad</p>
              </div>
              <div className="house-item">
                <img src={casa6} alt="Casa 6" />
                <p>Cabaña frente al lago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen3;

// src/components/homescreen.jsx
import React from "react";
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

const Homescreen = () => {
  return (
    <>
      {/* Sección Principal */}
      <section className="home-screen">
        <div className="text-container">
          <h1>Descubre un Nuevo Estilo.</h1>
          <p>
            <strong>Explora diseños únicos y funcionales para tu vida.</strong>
          </p>
          <div className="stats">
            <span>
              +500 <strong>USUARIOS</strong>
            </span>
            <span>
              +1500 <strong>PUBLICACIONES</strong>
            </span>
            <span>
              <strong>NUEVOS LUGARES</strong> <br /> DIFERENTES EXPERIENCIAS
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

      {/* Nueva Sección colocada hoy 30/03/2025 */}
      <div className="image-container-2">
        <div className="new-section">
          <h2>Explora Nuevas Casas</h2>
          <input type="text" placeholder="Escribe aquí..." />

          {/* Image grid ayuda a centrar las 6 imagenes */}
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

export default Homescreen;

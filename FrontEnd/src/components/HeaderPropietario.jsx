import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { getToken, decodeJwt } from "../utils/jwt";
import "../HeaderPropietario.css";

const HeaderPropietario = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUsuario(decodeJwt(token));
    }
  }, []);

  return (
    <header className="header-propietario-container">
      <div className="header-propietario-left">
        <Link to="/home2" className="header-propietario-link">INICIO</Link>
        <Link to="/buscar" className="header-propietario-link">BUSCAR</Link>
        <Link to="/misAvisos" className="header-propietario-link">MIS AVISOS</Link>
        <Link to="/crearEspacio" className="header-propietario-link">CREAR AVISO</Link>
        <Link to="/acuerdos" className="header-propietario-link">ACUERDOS</Link>
        <Link to="/mensajes/:idConversacion" className="header-propietario-link">MENSAJES</Link>
      </div>
      <div className="header-propietario-right">
        <CircleUserRound size={20} />
        <Link to="/usuario" className="header-propietario-link">
          {usuario?.sub || "PROPIETARIO"}
        </Link>
      </div>
    </header>
  );
};

export default HeaderPropietario;

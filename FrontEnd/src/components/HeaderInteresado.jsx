import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import { getToken, decodeJwt } from "../utils/jwt";
import "../HeaderInteresado.css";

const HeaderInteresado = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUsuario(decodeJwt(token));
    }
  }, []);

  return (
    <header className="header-interesado-container">
      <div className="header-interesado-left">
        <Link to="/home3" className="header-interesado-link">INICIO</Link>
        <Link to="/buscar" className="header-interesado-link">BUSCAR</Link>
        <Link to="/acuerdos" className="header-interesado-link">ACUERDOS</Link>
        <Link to="/mensajes/:idConversacion" className="header-interesado-link">MENSAJES</Link>
      </div>
      <div className="header-interesado-right">
        <CircleUserRound size={20} />
        <Link to="/usuario" className="header-interesado-link">
          {usuario?.sub || "USUARIO"}
        </Link>
      </div>
    </header>
  );
};

export default HeaderInteresado;

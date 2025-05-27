// src/components/PaginaChat.jsx
import React from 'react';
import Conversaciones from './Conversaciones';
import ChatConversacion from './ChatConversacion';
import { getToken, decodeJwt } from '../utils/jwt';
import HeaderPropietario from './HeaderPropietario';
import HeaderInteresado from './HeaderInteresado';
import '../paginaChat.css';

const PaginaChat = () => {
  const token = getToken();
  const { rol } = token ? decodeJwt(token) : {};
  const Header = rol === "Propietario" ? HeaderPropietario : HeaderInteresado;

  return (
    <>
      <Header />

      <div className="chat-page-container">
        <aside className="conversaciones-panel">
          <Conversaciones />
        </aside>
        <main className="chat-panel">
          <ChatConversacion />
        </main>
      </div>
    </>
  );
};

export default PaginaChat;

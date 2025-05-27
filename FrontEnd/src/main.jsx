import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Login from "./components/login";
import SignUp from "./components/SignUp";
import "./index.css";
import HomeScreen2 from "./components/HomeScreen2";
import CreateAdvise from "./components/createAdvise.jsx";
import ForgotPassword from "./components/forgotPassword.jsx";
import MisAvisos from "./components/misAvisos.jsx";
import Usuario from "./components/usuario.jsx";
import ActualizarUsuario from "./components/actualizarUsuario.jsx";
import EditarAviso from "./components/editarAviso.jsx";
import SelectRole from "./components/selectRole.jsx";
import HomeScreen3 from "./components/homescreen3.jsx"; 
import Espacio from "./components/espacio.jsx";
import VerificarCuenta from './components/verificarCuenta.jsx'; // o desde donde la crees
import RestablecerPassword from './components/RestablecerPassword.jsx'; // o desde donde la crees
import BuscarAvisos from './components/BuscarAvisos.jsx'; // o desde donde la crees
import RecuperarPalabraSecreta from './components/recuperarPalabraSecreta.jsx'; // o desde donde la crees
import DetalleAviso from "./components/DetalleAviso";
import Administrador from "./components/administrador.jsx";
import AcuerdoForm from "./components/acuerdoForm.jsx";
import RegistrarAcuerdo from "./components/registrarAcuerdo.jsx";
import Conversaciones from "./components/Conversaciones.jsx";
import ChatConversacion from "./components/ChatConversacion.jsx";
import PaginaChat from "./components/paginaChat.jsx";
import Acuerdos from "./components/Acuerdos.jsx";
import EditAcuerdoForm from "./components/EditAcuerdoForm.jsx";
import CalificarAcuerdo from "./components/CalificarAcuerdo.jsx";

//se agrega una variable con la ruta obtenida en googleAuth
const CLIENT_ID =
  "662156972025-10dk57drf0bme8g6j08qqg1i70g3e8gq.apps.googleusercontent.com";

// Rutas de la app
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/SignUp",
    element: <SignUp />,
  },

  {
    path: "/forgotPassword",
    element: <ForgotPassword />,
  },

  {
    path: "/home2",
    element: <HomeScreen2 />,
  },
  {
    path: "/crear-aviso",
    element: <CreateAdvise />,
  },
  {
    path: "/misAvisos",
    element: <MisAvisos />,
  },
  {
    path: "/usuario",
    element: <Usuario />,
  },
  {
    path: "/actualizarUsuario",
    element: <ActualizarUsuario />,
  },
  //{
    //path: "/editarAviso",
    //element: <EditarAviso />,
  //},
  {
    path: "/selectRole",
    element: <SelectRole />,
  },

  {
    path: "/crear-aviso",
    element: <CreateAdvise />,
  },
  {
    path: "/editarAviso/:idAviso",
    element: <EditarAviso />,
  },
  //{
    //path: "/editarAviso/:id", // <-- Asegura que recibe el ID del aviso a editar
    //element: <EditarAviso />,
  //},
  {
    path: "/home3", // <-- Asegura que recibe el ID del aviso a editar
    element: <HomeScreen3 />,
  },
  {
    path: "/crearEspacio", // <-- Asegura que recibe el ID del aviso a editar
    element: <Espacio />,
  },
  {
    path: "/verificar", 
    element: <VerificarCuenta />,
  },
  {
    path: "/space/usuarios/restablecer", 
    element: <RestablecerPassword />,
  },
  {
    path: "/buscar", 
    element: <BuscarAvisos />,
  },
  {
    path: "/recuperarPalabraSecreta", 
    element: <RecuperarPalabraSecreta />,
  },
  {
  path: "/aviso/:id",
  element: <DetalleAviso />,
  },
  {
  path: "/Administrador",
  element: <Administrador />,
  },
   {
  path: "/registrarAcuerdo",
  element: <RegistrarAcuerdo />,
  },{
  path: "/mensajes",
  element: <Conversaciones />,
  },
  {
    path: "/mensajes/:idConversacion",  // chat de una conversación específica
    element: <PaginaChat />
  },{
    path: "/acuerdo/crear/:idEspacios",  // chat de una conversación específica
    element: <AcuerdoForm />
  },{
    path: "/acuerdos",  // chat de una conversación específica
    element: <Acuerdos />
  },{
    path: "/acuerdo/editar/:idAcuerdo",  // chat de una conversación específica
    element: <EditAcuerdoForm  />
  },{
    path: "/acuerdo/calificar/:idAcuerdo",  // chat de una conversación específica
    element: <CalificarAcuerdo  />
  }
]);

// Renderizado principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

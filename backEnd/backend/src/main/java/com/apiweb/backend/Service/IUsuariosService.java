package com.apiweb.backend.Service;

import com.apiweb.backend.Model.usuariosModel;
import java.util.List;

public interface IUsuariosService {
    usuariosModel registrarUsuario(usuariosModel usuario);
    boolean verificarToken(String token);
    String solicitarRecuperacion(String email);
    String restablecerContrasena(String token, String nuevaContrasena);
    List<usuariosModel> listarUsuarios();
    void eliminarUsuario(Integer id);
    usuariosModel actualizarUsuario(Integer idUsuarios, usuariosModel usuarioActualizado);
    usuariosModel iniciarSesion(String nombreUsuario, String contrasena);
    usuariosModel findByNombreUsuario(String nombreUsuario);
    usuariosModel obtenerUsuarioPorTokenRecuperacion(String token);
    usuariosModel processGoogleLogin(String email, String fullName);
}

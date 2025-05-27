package com.apiweb.backend.Service;

import com.apiweb.backend.Model.usuariosModel;
import com.apiweb.backend.Repository.IUsuariosRepository;
import com.apiweb.backend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class usuariosServiceImp implements IUsuariosService {

    private static final int VERIFICATION_TOKEN_EXPIRATION_HOURS = 24;

    private static final long TOKEN_EXPIRATION_HOURS = 24;

    @Autowired
    private IUsuariosRepository usuariosRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public usuariosModel registrarUsuario(usuariosModel usuario) {
        if (usuariosRepository.existsByNombreUsuario(usuario.getNombreUsuario())) {
            throw new RuntimeException("Ya hay un usuario con este nombre registrado.");
        }
        if (usuariosRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Ya hay un usuario con este email registrado.");
        }
        if (usuario.getContrasena() == null || usuario.getContrasena().length() < 8) {
            throw new RuntimeException("La contraseña debe tener mínimo 8 caracteres.");
        }
        if (usuario.getTelefono() == null || usuario.getTelefono().length() != 10) {
            throw new RuntimeException("El teléfono debe tener 10 dígitos.");
        }

        String contrasenaEncriptada = passwordEncoder.encode(usuario.getContrasena());
        usuario.setContrasena(contrasenaEncriptada);

        String token = UUID.randomUUID().toString();
        usuario.setVerificationToken(token);
        usuario.setTokenCreationDate(LocalDateTime.now());
        usuario.setEnabled(false);

        usuariosModel nuevo = usuariosRepository.save(usuario);

        emailService.enviarCorreoVerificacion(nuevo.getEmail(), token);

        return nuevo;
    }

    @Override
    public boolean verificarToken(String token) {
        usuariosModel user = usuariosRepository.findByVerificationToken(token).orElse(null);
        if (user == null) {
            return false;
        }
        LocalDateTime expiry = user.getTokenCreationDate().plusHours(VERIFICATION_TOKEN_EXPIRATION_HOURS);
        if (LocalDateTime.now().isAfter(expiry)) {
            return false;
        }
        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setTokenCreationDate(null);
        usuariosRepository.save(user);
        return true;
    }

    @Override
    public List<usuariosModel> listarUsuarios() {
        return usuariosRepository.findAll();
    }

    @Override
    public void eliminarUsuario(Integer id) {
        if (!usuariosRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuariosRepository.deleteById(id);
    }

    @Override
    public usuariosModel actualizarUsuario(Integer idUsuarios, usuariosModel usuarioActualizado) {
        usuariosModel usuarioExistente = usuariosRepository.findById(idUsuarios)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuarioActualizado.getEmail() != null && !usuarioActualizado.getEmail()
                .equals(usuarioExistente.getEmail())) {
            if (usuariosRepository.existsByEmail(usuarioActualizado.getEmail())) {
                throw new BadRequestException("El email ya está registrado.");
            }
            usuarioExistente.setEmail(usuarioActualizado.getEmail());
        }

        if (usuarioActualizado.getNombreUsuario() != null && !usuarioActualizado.getNombreUsuario()
                .equals(usuarioExistente.getNombreUsuario())) {
            if (usuariosRepository.existsByNombreUsuario(usuarioActualizado.getNombreUsuario())) {
                throw new BadRequestException("El nombre de usuario ya está registrado.");
            }
            usuarioExistente.setNombreUsuario(usuarioActualizado.getNombreUsuario());
        }

        if (usuarioActualizado.getContrasena() != null) {
            String nuevaPass = passwordEncoder.encode(usuarioActualizado.getContrasena());
            usuarioExistente.setContrasena(nuevaPass);
        }

        if (usuarioActualizado.getTelefono() != null) {
            usuarioExistente.setTelefono(usuarioActualizado.getTelefono());
        }
        if (usuarioActualizado.getPalabraSecreta() != null) {
            usuarioExistente.setPalabraSecreta(usuarioActualizado.getPalabraSecreta());
        }
        if (usuarioActualizado.getRol() != null) {
            usuarioExistente.setRol(usuarioActualizado.getRol());
        }
        if (usuarioActualizado.getFotoPerfil() != null) {
            usuarioExistente.setFotoPerfil(usuarioActualizado.getFotoPerfil());
        }

        return usuariosRepository.save(usuarioExistente);
    }

    @Override
    public usuariosModel iniciarSesion(String nombreUsuario, String contrasena) {
        usuariosModel usuario = usuariosRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario o contraseña incorrectos."));

        if (!passwordEncoder.matches(contrasena, usuario.getContrasena())) {
            throw new RuntimeException("Usuario o contraseña incorrectos.");
        }

        if (!usuario.isEnabled()) {
            throw new RuntimeException("Debes verificar tu cuenta antes de iniciar sesión, revisa el mensaje que se ha enviado a tu correo");
        }

        return usuario;
    }

    @Override
    public String solicitarRecuperacion(String email) {
        usuariosModel usuario = usuariosRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No se encontró un usuario con ese correo"));

        String tokenRecuperacion = UUID.randomUUID().toString();
        usuario.setRecoveryToken(tokenRecuperacion);
        usuario.setRecoveryTokenCreationDate(LocalDateTime.now());
        usuariosRepository.save(usuario);

        emailService.enviarCorreoRecuperacion(email, tokenRecuperacion);
        return "Se ha enviado un correo de recuperación a " + email;
    }

    /**
     * Aquí el nuevo método que comprueba el token, actualiza la contraseña
     * y limpia los campos de recuperación.
     */
    @Override
    public String restablecerContrasena(String token, String nuevaContrasena) {
        usuariosModel user = usuariosRepository.findByRecoveryToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido."));

        // Verificar expiración
        LocalDateTime expiry = user.getRecoveryTokenCreationDate()
                .plusHours(TOKEN_EXPIRATION_HOURS);
        if (LocalDateTime.now().isAfter(expiry)) {
            throw new RuntimeException("El enlace de recuperación ha expirado.");
        }

        // Encriptar y actualizar contraseña
        user.setContrasena(passwordEncoder.encode(nuevaContrasena));

        // Limpiar token
        user.setRecoveryToken(null);
        user.setRecoveryTokenCreationDate(null);

        usuariosRepository.save(user);
        return "Contraseña actualizada correctamente.";
    }

    public usuariosModel obtenerUsuarioPorTokenRecuperacion(String token) {
        return usuariosRepository.findByRecoveryToken(token)
                .filter(user -> user.getRecoveryTokenCreationDate()
                        .plusHours(TOKEN_EXPIRATION_HOURS)
                        .isAfter(LocalDateTime.now()))
                .orElse(null);
    }

    @Override
    public usuariosModel findByNombreUsuario(String nombreUsuario) {
        return usuariosRepository
            .findByNombreUsuario(nombreUsuario)
            .orElseThrow(() -> 
                new UsernameNotFoundException("Usuario '" + nombreUsuario + "' no encontrado"));
    }

    @Override
    public usuariosModel processGoogleLogin(String email, String fullName) {
        // 1) buscar usuario por email
        usuariosModel user = usuariosRepository.findByEmail(email).orElse(null);
        if (user != null) {
            // si ya existe, devolverlo
            return user;
        }
        // 2) si no existe, crear uno nuevo
        usuariosModel nuevo = new usuariosModel();
        // asigna un nombre de usuario único (por ejemplo, el prefijo del email)
        String userName = email.split("@")[0];
        nuevo.setNombreUsuario(userName);
        nuevo.setEmail(email);
        nuevo.setEnabled(true);
        // si tu modelo tiene campo para nombre completo:
        // generamos una password aleatoria (nunca usada) para llenar el campo requerido
        String randomPass = UUID.randomUUID().toString();
        nuevo.setContrasena(passwordEncoder.encode(randomPass));
        // guardamos sin token de verificación
        return usuariosRepository.save(nuevo);
    }
}



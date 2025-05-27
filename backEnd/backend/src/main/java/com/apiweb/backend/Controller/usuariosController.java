package com.apiweb.backend.Controller;

import com.apiweb.backend.Model.usuariosModel;
import com.apiweb.backend.Service.IUsuariosService;
import com.apiweb.backend.security.jwt.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.MediaType;

import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;

import com.apiweb.backend.exception.BadRequestException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.apiweb.backend.Service.S3Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/space/usuarios")
public class usuariosController {

    @Autowired
    private IUsuariosService usuariosService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private S3Service s3Service;

    @PostMapping("/registrar")
    public ResponseEntity<String> crearUsuario(@RequestBody usuariosModel usuario) {
        try {
            usuariosService.registrarUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Usuario creado. Revisa tu correo para verificar la cuenta.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno al registrar usuario.");
        }
    }

    @GetMapping("/verificar")
    public ResponseEntity<String> verificarCuenta(@RequestParam String token) {
        boolean ok = usuariosService.verificarToken(token);
        if (ok) {
            return ResponseEntity.ok("Ya puedes cerrar esta ventana.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Token inválido o expirado.");
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<usuariosModel>> listarUsuarios() {
        return ResponseEntity.ok(usuariosService.listarUsuarios());
    }

    @GetMapping("/{idUsuarios}")
    public ResponseEntity<usuariosModel> obtenerUsuarioPorId(@PathVariable Integer idUsuarios) {
        usuariosModel user = usuariosService.listarUsuarios()
            .stream()
            .filter(u -> u.getIdUsuarios().equals(idUsuarios))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado")); 
        return ResponseEntity.ok(user);
    }


    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarUsuario(@PathVariable Integer id) {
        try {
            usuariosService.eliminarUsuario(id);
            return ResponseEntity.ok("Usuario eliminado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping(
    value   = "/editar/{idUsuarios}",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> editarUsuarioMultipart(
            @PathVariable Integer idUsuarios,
            @RequestPart("usuario") String usuarioJson,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {
        try {
            System.out.println("→ [BACK] editarUsuarioMultipart llamado para id = " + idUsuarios);
            System.out.println("→ [BACK] usuarioJson recibido: " + usuarioJson);
            System.out.println("→ [BACK] foto == null? " + (foto == null));

            // 1) Parsear JSON a objeto
            ObjectMapper mapper = new ObjectMapper();
            usuariosModel usuarioActualizado = mapper.readValue(usuarioJson, usuariosModel.class);

            // 2) Si hay foto, subir a S3
            if (foto != null && !foto.isEmpty()) {
                System.out.println("→ [BACK] foto recibida: " 
                    + foto.getOriginalFilename() + " (" + foto.getSize() + " bytes)");
                
                String url = s3Service.subirArchivo(foto);
                System.out.println("→ [BACK] URL subida a S3: " + url);
                
                usuarioActualizado.setFotoPerfil(url);
            } else {
                System.out.println("→ [BACK] no se recibió foto o estaba vacía");
            }

            // 3) Llamar al servicio para actualizar (persistir campos y fotoPerfil)
            usuariosModel editado = usuariosService.actualizarUsuario(idUsuarios, usuarioActualizado);
            System.out.println("→ [BACK] usuarioActualizado en BD: fotoPerfil = " + editado.getFotoPerfil());

            // 4) Devolver el objeto actualizado
            return ResponseEntity.ok(editado);

        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("JSON inválido en el part 'usuario'.");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al subir la imagen.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado: " + e.getMessage());
        }
    }

    @PostMapping("/iniciarSesion")
    public ResponseEntity<Map<String, String>> iniciarSesion(
            @RequestParam String nombreUsuario,
            @RequestParam String contrasena) {
        try {
            // 1) Validar usuario y contraseña
            usuariosModel usuario = usuariosService.iniciarSesion(nombreUsuario, contrasena);

            // 2) Generar JWT
            String token = jwtUtils.generateToken(usuario.getNombreUsuario(), usuario.getIdUsuarios(), usuario.getRol()
            );

            // 3) Devolver mensaje y token
            Map<String, String> body = new HashMap<>();
            body.put("message", "Autenticación exitosa");
            body.put("token", token);
            return ResponseEntity.ok(body);

        } catch (RuntimeException e) {
            Map<String, String> err = Map.of("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }
    }

    @PostMapping("/recuperacion-por-usuario")
    public ResponseEntity<String> solicitarRecuperacionPorUsuario(
            @RequestParam("username") String username) {

        // Busca el usuario por nombre de usuario (lanza excepción si no existe)
        usuariosModel user = usuariosService.findByNombreUsuario(username);

        // Llama al método existente que envía el correo a su email
        String respuesta = usuariosService.solicitarRecuperacion(user.getEmail());

        return ResponseEntity.ok(respuesta);
    }

     @GetMapping("/restablecer")
     public ResponseEntity<String> validarTokenRecuperacion(@RequestParam String token) {
         usuariosModel usuario = usuariosService.obtenerUsuarioPorTokenRecuperacion(token);
         if (usuario == null) {
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido o expirado.");
         }
         return ResponseEntity.ok("Token válido. Puedes restablecer la contraseña.");
     }
     
     
    @PostMapping("/restablecer")
    public ResponseEntity<Map<String,String>> restablecer(
            @RequestParam String token,
            @RequestParam String nuevaContrasena) {
        try {
            String msg = usuariosService.restablecerContrasena(token, nuevaContrasena);
            return ResponseEntity.ok(Map.of("message", msg));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("error", e.getMessage())); 
        }
    }

    @Value("${google.client.id}")
    private String googleClientId;

    @PostMapping("/login-google")
    public ResponseEntity<Map<String,String>> loginWithGoogle(@RequestBody Map<String,String> body) {
        String idTokenString = body.get("token");
        System.out.println("→ [BACK] idTokenString recibido: " + idTokenString);
        System.out.println("→ [BACK] googleClientId = '" + googleClientId + "'");
    
        NetHttpTransport transport = new NetHttpTransport();
        GsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
            .setAudience(Collections.singletonList(googleClientId))
            .setIssuers(List.of("https://accounts.google.com", "accounts.google.com"))
            .build();
    
        GoogleIdToken idToken = null;
        try {
            idToken = verifier.verify(idTokenString);
        } catch (GeneralSecurityException | IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                       .body(Map.of("error","Error al verificar token de Google"));
        }
        System.out.println(idToken == null
            ? "→ [BACK] verify() devolvió null"
            : "→ [BACK] verify() OK → email=" + idToken.getPayload().getEmail());
    
        if (idToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                       .body(Map.of("error","Token de Google inválido"));
        }
        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name  = (String) payload.get("name");

        usuariosModel user = usuariosService.processGoogleLogin(email, name);
        String jwt = jwtUtils.generateToken(user.getNombreUsuario(), user.getIdUsuarios(), user.getRol()
        );

        Map<String,String> resp = new HashMap<>();
        resp.put("message", "Autenticación con Google exitosa");
        resp.put("token", jwt);
        return ResponseEntity.ok(resp); 
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<Map<String,String>> refreshToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token faltante"));
        }
        String oldToken = header.substring(7);
        if (!jwtUtils.validateToken(oldToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token inválido o expirado"));
        }
        String username = jwtUtils.getUsernameFromToken(oldToken);
        Integer idUsuarios = jwtUtils.getAllClaimsFromToken(oldToken)
                                      .get("idUsuarios", Integer.class);
        String rol = jwtUtils.getAllClaimsFromToken(oldToken)
                             .get("rol", String.class);
        String newToken = jwtUtils.generateToken(username, idUsuarios, rol);
        return ResponseEntity.ok(Map.of("token", newToken));
    } 
}


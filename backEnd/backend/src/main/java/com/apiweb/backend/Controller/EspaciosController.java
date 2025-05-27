// src/main/java/com/apiweb/backend/Controller/EspaciosController.java
package com.apiweb.backend.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.apiweb.backend.Model.espaciosModel;
import com.apiweb.backend.Model.usuariosModel;
import com.apiweb.backend.Service.IEspaciosService;
import com.apiweb.backend.Service.IUsuariosService;

@RestController
@RequestMapping("/space/espacios")
public class EspaciosController {

    @Autowired private IEspaciosService espaciosService;
    @Autowired private IUsuariosService usuariosService;

    @PostMapping("/registrar")
    public ResponseEntity<String> crearEspacios(
            @RequestBody espaciosModel espacio,
            Authentication authentication) {
        try {
            String nombreUsuario = authentication.getName();
            usuariosModel usuario = usuariosService.findByNombreUsuario(nombreUsuario);
            espacio.setUsuario(usuario);
            espaciosService.guardarEspacios(espacio);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Espacio creado exitosamente");
        } catch (RuntimeException e) {
            // Aquí caerán tus “Ya existe …”
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<espaciosModel>> listarEspacios(Authentication auth) {
        String nombreUsuario = auth.getName();
        return ResponseEntity.ok(espaciosService.listarPorUsuario(nombreUsuario));
    }

    @DeleteMapping("/eliminar/{idEspacios}")
    public ResponseEntity<String> eliminarEspacio(@PathVariable int idEspacios) {
        try {
            espaciosService.eliminarEspacio(idEspacios);
            return ResponseEntity.ok("Espacio eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/editar/{idEspacio}")
    public ResponseEntity<String> editarEspacio(
            @PathVariable Integer idEspacio,
            @RequestBody espaciosModel espacioActualizado) {
        try {
            espaciosService.actualizarEspacio(idEspacio, espacioActualizado);
            return ResponseEntity.ok("El espacio fue editado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}

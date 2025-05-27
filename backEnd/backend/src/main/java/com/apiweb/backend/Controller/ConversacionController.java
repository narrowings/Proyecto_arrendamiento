package com.apiweb.backend.Controller;

import com.apiweb.backend.Model.conversacionModel;
import com.apiweb.backend.Service.IConversacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/space/conversacion")
public class ConversacionController {

    @Autowired
    private IConversacionService conversacionService;

    @PostMapping("/crear-o-get")
    public ResponseEntity<conversacionModel> crearOObtenerConversacion(@RequestBody conversacionModel conversacion) {
        return ResponseEntity.ok(conversacionService.crearOObtenerConversacion(conversacion));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<conversacionModel>> getConversacionesPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(conversacionService.obtenerConversacionesPorUsuario(idUsuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<conversacionModel> getConversacionPorId(@PathVariable Integer id) {
        return conversacionService.obtenerConversacionPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarConversacion(@PathVariable Integer id) {
        conversacionService.eliminarConversacion(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<conversacionModel> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        conversacionModel updated = conversacionService.actualizarEstado(id, estado);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/dueño/{idUsuario}")
    public ResponseEntity<List<conversacionModel>> 
        getConversacionesPorDueñoDeAviso(@PathVariable Integer idUsuario) {

    return ResponseEntity.ok(
        conversacionService.obtenerConversacionesPorDueñoDeAviso(idUsuario)
        );
    }

}


/*package com.apiweb.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apiweb.backend.Model.interesAvisoModel;
import com.apiweb.backend.Service.IInteresAvisoService;

@RestController
@RequestMapping("/space/interesAviso")
public class InteresAvisoController {
    @Autowired 
    IInteresAvisoService interesAvisoService;

    @PostMapping("/registrar")
    public ResponseEntity<String> crearInteresAviso(@RequestBody interesAvisoModel interesAviso) {
        interesAvisoService.guardarInteresAviso(interesAviso);
        return new ResponseEntity<>("Interés creado exitosamente", HttpStatus.CREATED);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<interesAvisoModel>> listarInteresAvisos(){
        return new ResponseEntity<>(interesAvisoService.listarInteresAvisos(), HttpStatus.OK);
    }
    @DeleteMapping("/eliminar/{idInteresAviso}")
    public ResponseEntity<String> eliminarInteresAviso(@PathVariable int idInteresAviso) {
        try {
            interesAvisoService.eliminarInteresAviso(idInteresAviso);
            return ResponseEntity.ok("Interés en aviso eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}*/

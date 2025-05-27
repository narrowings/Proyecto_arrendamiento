package com.apiweb.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.apiweb.backend.Model.denunciasModel;
import com.apiweb.backend.Service.IDenunciasService;

@RestController
@RequestMapping("/space/denuncias")
public class DenunciasController {
    @Autowired IDenunciasService denunciasService;
    @PostMapping("/registrar")
    public ResponseEntity<String> crearDenuncias(@RequestBody denunciasModel denuncias) {
        denunciasService.guardarDenuncias(denuncias);
        return new ResponseEntity<>("Denuncia creada exitosamente", HttpStatus.CREATED);
    }
    
    @GetMapping("/listar")
    public ResponseEntity<List<denunciasModel>> listarDenuncias(){
        return new ResponseEntity<>(denunciasService.listarDenuncias(),HttpStatus.OK);
    }
    @GetMapping("/listar/{idAviso}")
    public ResponseEntity<?> listarDenunciasPorAviso(@PathVariable Integer idAviso) {
        List<denunciasModel> denuncias = denunciasService.listarDenunciasPorAviso(idAviso);
        if (denuncias.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No hay denuncias para este aviso");
        }
        return new ResponseEntity<>(denuncias, HttpStatus.OK);
    }

}

package com.apiweb.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.apiweb.backend.Model.notificacionesModel;
import com.apiweb.backend.Service.INotificacionesService;

@RestController
@RequestMapping("/space/notificaciones")
public class NotificacionesController {
    @Autowired 
    INotificacionesService notificacionesService;

    @PostMapping("/registrar")
    public ResponseEntity<String> crearNotificaciones(@RequestBody notificacionesModel notificaciones) {
        notificacionesService.guardarNotificaciones(notificaciones);
        return new ResponseEntity<>("Notificación creada exitosamente", HttpStatus.CREATED);
    }


    @GetMapping("/listar")
    public ResponseEntity<List<notificacionesModel>> listarNotificaciones(){
        return new ResponseEntity<>(notificacionesService.listarNotificaciones(), HttpStatus.OK);
    }
}

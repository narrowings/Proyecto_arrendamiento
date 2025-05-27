package com.apiweb.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apiweb.backend.Model.notificacionesModel;
import com.apiweb.backend.Repository.INotificacionesRepository;

@Service
public class NotificacionesServiceImp implements INotificacionesService {
    @Autowired 
    INotificacionesRepository notificacionesRepository;

    @Override
    public notificacionesModel guardarNotificaciones(notificacionesModel notificaciones) {
        return notificacionesRepository.save(notificaciones);
    }

    @Override
    public List<notificacionesModel> listarNotificaciones() {
        return notificacionesRepository.findAll();
    }
}

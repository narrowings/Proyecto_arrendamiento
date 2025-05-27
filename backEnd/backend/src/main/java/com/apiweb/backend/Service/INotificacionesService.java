package com.apiweb.backend.Service;

import java.util.List;

import com.apiweb.backend.Model.notificacionesModel;

public interface INotificacionesService {
    notificacionesModel guardarNotificaciones(notificacionesModel notificaciones);
    List<notificacionesModel> listarNotificaciones();
}

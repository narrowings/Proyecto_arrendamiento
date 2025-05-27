package com.apiweb.backend.Service;

import com.apiweb.backend.Model.conversacionModel;

import java.util.List;
import java.util.Optional;

public interface IConversacionService {
    conversacionModel crearOObtenerConversacion(conversacionModel conversacion);
    List<conversacionModel> obtenerConversacionesPorUsuario(Integer idUsuario);
    Optional<conversacionModel> obtenerConversacionPorId(Integer id);
    void eliminarConversacion(Integer id);
    conversacionModel actualizarEstado(Integer id, String estado);
    List<conversacionModel> obtenerConversacionesPorDueñoDeAviso(Integer idUsuario);
}
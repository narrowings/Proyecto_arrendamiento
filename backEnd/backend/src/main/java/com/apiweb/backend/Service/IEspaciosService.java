package com.apiweb.backend.Service;

import java.util.List;

import com.apiweb.backend.Model.espaciosModel;

public interface IEspaciosService {
    espaciosModel guardarEspacios(espaciosModel espacios);
    List<espaciosModel> listarEspacios();
    void eliminarEspacio(Integer idEspacios);
    espaciosModel actualizarEspacio(Integer idEspacios, espaciosModel espacioActualizado);
    List<espaciosModel> listarPorUsuario(String nombreUsuario);
}

package com.apiweb.backend.Service;

import java.util.List;
import java.util.Set;

import com.apiweb.backend.Model.avisosModel;

public interface IAvisosService {
    avisosModel guardarAvisos(avisosModel avisos);
    List<avisosModel> listarAvisos();
    void eliminarAviso(Integer idAvisos);
    avisosModel actualizarAviso(Integer idAviso, avisosModel avisoActualizado);
    List<avisosModel> listarPorEspacios(Set<Integer> espacioIds);
    avisosModel obtenerAvisoPorId(Integer idAvisos);

}

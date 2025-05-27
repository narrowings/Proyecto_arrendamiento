package com.apiweb.backend.Service;

import java.util.List;

import com.apiweb.backend.Model.denunciasModel;

public interface IDenunciasService {
    denunciasModel guardarDenuncias(denunciasModel denuncias);
    List<denunciasModel> listarDenuncias();
    List<denunciasModel> listarDenunciasPorAviso(Integer idAviso);
}

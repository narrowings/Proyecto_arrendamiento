package com.apiweb.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apiweb.backend.Model.denunciasModel;
import com.apiweb.backend.Repository.IDenunciasRepository;

@Service
public class DenunciasServiceImp implements IDenunciasService {
    @Autowired IDenunciasRepository denunciasRepository;
    @Override
    public denunciasModel guardarDenuncias(denunciasModel denuncias) {
        return denunciasRepository.save(denuncias);
    }

    @Override
    public List<denunciasModel> listarDenuncias() {
        return denunciasRepository.findAll();
    } 
    public List<denunciasModel> listarDenunciasPorAviso(Integer idAviso) {
        return denunciasRepository.findByIdAvisos_IdAvisos(idAviso); // Consulta personalizada para buscar por idAvisos
    }
}

/*package com.apiweb.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apiweb.backend.Model.interesAvisoModel;
import com.apiweb.backend.Repository.IInteresAvisoRepository;

@Service
public class InteresAvisoServiceImp implements IInteresAvisoService {
    @Autowired 
    IInteresAvisoRepository interesAvisoRepository;

    @Override
    public interesAvisoModel guardarInteresAviso(interesAvisoModel interesAviso) {
        return interesAvisoRepository.save(interesAviso);
    }

    @Override
    public List<interesAvisoModel> listarInteresAvisos() {
        return interesAvisoRepository.findAll();
    }
    
    @Override
    public void eliminarInteresAviso(Integer idInteresAviso) {
        if (!interesAvisoRepository.existsById(idInteresAviso)){
            throw new RuntimeException("InteresAviso no encontrado");

        }
        interesAvisoRepository.deleteById(idInteresAviso);
    }
    
}
*/
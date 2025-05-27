package com.apiweb.backend.Service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.apiweb.backend.Model.avisosModel;
import com.apiweb.backend.Repository.IAvisosRepository;

@Service
public class AvisosServiceImp implements IAvisosService{
    @Autowired IAvisosRepository avisosRepository;
    @Override
    public avisosModel guardarAvisos(avisosModel avisos) {
        try {
            return avisosRepository.save(avisos);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Este espacio no existe o ya existe un aviso para este espacio. Cada espacio solo puede tener un aviso.");
        }
    }

    @Override
    public List<avisosModel> listarAvisos() {
        return avisosRepository.findAll();
    }

    @Override
    public List<avisosModel> listarPorEspacios(Set<Integer> espacioIds) {
        return avisosRepository.findByIdEspacios_IdEspaciosIn(espacioIds);
    }

    @Override
    public avisosModel obtenerAvisoPorId(Integer idAvisos) {
        return avisosRepository.findById(idAvisos)
            .orElseThrow(() -> new RuntimeException("Aviso no encontrado con id " + idAvisos));
    }

    @Override
    public void eliminarAviso(Integer idAvisos) {
        if (!avisosRepository.existsById(idAvisos)){
            throw new RuntimeException("Aviso no encontrado");

        }
        avisosRepository.deleteById(idAvisos);
    }

    @Override
    public avisosModel actualizarAviso(Integer idAviso, avisosModel avisoActualizado) {
        avisosModel avisoExistente = avisosRepository.findById(idAviso)
            .orElseThrow(() -> new RuntimeException("Aviso no encontrado"));
            
        if (avisoActualizado.getIdEspacios() != null) {
            avisoExistente.setIdEspacios(avisoActualizado.getIdEspacios());
        }
        if (avisoActualizado.getTitulo() != null) {
            avisoExistente.setTitulo(avisoActualizado.getTitulo());
        }
        if (avisoActualizado.getDescripcion() != null) {
            avisoExistente.setDescripcion(avisoActualizado.getDescripcion());
        }
        if (avisoActualizado.getPrecio() != null) {
            avisoExistente.setPrecio(avisoActualizado.getPrecio());
        }
        if (avisoActualizado.getCondicionesAdicionales() != null) {
            avisoExistente.setCondicionesAdicionales(avisoActualizado.getCondicionesAdicionales());
        }
        if (avisoActualizado.getImagenes() != null) {
            avisoExistente.setImagenes(avisoActualizado.getImagenes());
        }
        if (avisoActualizado.getEstado() != null) {
            avisoExistente.setEstado(avisoActualizado.getEstado());
        }

        return avisosRepository.save(avisoExistente);
    }

}

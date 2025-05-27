// src/main/java/com/apiweb/backend/Service/EspaciosServiceImp.java
package com.apiweb.backend.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apiweb.backend.Model.espaciosModel;
import com.apiweb.backend.Model.usuariosModel;
import com.apiweb.backend.Repository.IEspaciosRepository;
import com.apiweb.backend.Repository.IUsuariosRepository;

@Service
public class EspaciosServiceImp implements IEspaciosService {

    @Autowired
    private IEspaciosRepository espaciosRepository;

    @Autowired
    private IUsuariosRepository usuariosRepository;

    @Override
    public espaciosModel guardarEspacios(espaciosModel espacio) {
        Integer userId = espacio.getUsuario().getIdUsuarios();
        String tipo = espacio.getTipo().toLowerCase();

        switch (tipo) {
            case "apartamento":
                if (espaciosRepository.existsByTipoAndAptoAndUsuario_IdUsuarios(tipo, espacio.getApto(), userId)) {
                    throw new RuntimeException("Ya existe ese apartamento.");
                }
                break;
            case "habitacion":
                if (espaciosRepository.existsByTipoAndAptoAndHabitacionAndUsuario_IdUsuarios(
                        tipo, espacio.getApto(), espacio.getHabitacion(), userId)) {
                    throw new RuntimeException("Ya existe esa habitación en ese apartamento.");
                }
                break;
            case "casa":
                if (espaciosRepository.existsByTipoAndNumeroCasaAndUsuario_IdUsuarios(
                        tipo, espacio.getNumeroCasa(), userId)) {
                    throw new RuntimeException("Ya existe esa casa.");
                }
                break;
            case "parqueadero":
                if (espaciosRepository.existsByTipoAndParqueaderoAndUsuario_IdUsuarios(
                        tipo, espacio.getParqueadero(), userId)) {
                    throw new RuntimeException("Ya existe ese parqueadero.");
                }
                break;
            case "bodega":
                if (espaciosRepository.existsByTipoAndBodegaAndUsuario_IdUsuarios(
                        tipo, espacio.getBodega(), userId)) {
                    throw new RuntimeException("Ya existe esa bodega.");
                }
                break;
        }

        return espaciosRepository.save(espacio);
    }

    @Override
    public List<espaciosModel> listarEspacios() {
        return espaciosRepository.findAll();
    }

    @Override
    public List<espaciosModel> listarPorUsuario(String nombreUsuario) {
        usuariosModel usr = usuariosRepository.findByNombreUsuario(nombreUsuario)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return espaciosRepository.findByUsuario(usr);
    }

    @Override
    public void eliminarEspacio(Integer idEspacios) {
        if (!espaciosRepository.existsById(idEspacios)) {
            throw new RuntimeException("Espacio no encontrado");
        }
        espaciosRepository.deleteById(idEspacios);
    }

    @Override
    public espaciosModel actualizarEspacio(Integer idEspacios, espaciosModel espacioActualizado) {
        espaciosModel existente = espaciosRepository.findById(idEspacios)
            .orElseThrow(() -> new RuntimeException("Espacio no encontrado"));

        // Actualizar campos simples
        if (espacioActualizado.getTitulo()  != null) existente.setTitulo(espacioActualizado.getTitulo());
        if (espacioActualizado.getTipo()    != null) existente.setTipo(espacioActualizado.getTipo());
        if (espacioActualizado.getEstrato() != null) existente.setEstrato(espacioActualizado.getEstrato());

        // Campos dinámicos
        existente.setTorre(espacioActualizado.getTorre());
        existente.setApto(espacioActualizado.getApto());
        existente.setHabitacion(espacioActualizado.getHabitacion());
        existente.setNumeroCasa(espacioActualizado.getNumeroCasa());
        existente.setParqueadero(espacioActualizado.getParqueadero());
        existente.setBodega(espacioActualizado.getBodega());

        return espaciosRepository.save(existente);
    }
}

package com.apiweb.backend.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.apiweb.backend.Model.acuerdoArrendamientoModel;
import com.apiweb.backend.Repository.IAcuerdoArrendamientoRepository;

@Service
public class AcuerdoArrendamientoServiceImp implements IAcuerdoArrendamientoService {

    @Autowired
    private IAcuerdoArrendamientoRepository repo;

    @Override
    public acuerdoArrendamientoModel guardarAcuerdoArrendamiento(acuerdoArrendamientoModel a, MultipartFile pdf) throws IOException {
        if (pdf != null && !pdf.isEmpty()) {
            a.setContratoPdf(pdf.getBytes());
        }
        return repo.save(a);
    }

    @Override
    public List<acuerdoArrendamientoModel> listarAcuerdoArrendamientos() {
        return repo.findAll();
    }

    @Override
    public Optional<acuerdoArrendamientoModel> obtenerAcuerdoArrendamientoPorId(Integer id) {
        return repo.findById(id);
    }

    @Override
    public acuerdoArrendamientoModel actualizarAcuerdo(Integer id, acuerdoArrendamientoModel datos, MultipartFile pdf) throws IOException {
        acuerdoArrendamientoModel existente = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Acuerdo no encontrado"));
        existente.setFechaInicio(datos.getFechaInicio());
        existente.setFechaFin(datos.getFechaFin());
        existente.setEstado(datos.getEstado());
        existente.setCalificacionEspacio(datos.getCalificacionEspacio());
        existente.setComentarioEspacio(datos.getComentarioEspacio());
        existente.setCalificacionUsuario(datos.getCalificacionUsuario());
        existente.setComentarioUsuario(datos.getComentarioUsuario());
        if (pdf != null && !pdf.isEmpty()) {
            existente.setContratoPdf(pdf.getBytes());
        }
        return repo.save(existente);
    }
}

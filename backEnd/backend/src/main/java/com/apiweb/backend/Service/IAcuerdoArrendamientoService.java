package com.apiweb.backend.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.apiweb.backend.Model.acuerdoArrendamientoModel;

public interface IAcuerdoArrendamientoService {
    acuerdoArrendamientoModel guardarAcuerdoArrendamiento(acuerdoArrendamientoModel acuerdoArrendamiento, MultipartFile contratoPdf) throws IOException;
    List<acuerdoArrendamientoModel> listarAcuerdoArrendamientos();
    Optional<acuerdoArrendamientoModel> obtenerAcuerdoArrendamientoPorId(Integer id);
    acuerdoArrendamientoModel actualizarAcuerdo(Integer id, acuerdoArrendamientoModel datos, MultipartFile pdf) throws IOException;
}

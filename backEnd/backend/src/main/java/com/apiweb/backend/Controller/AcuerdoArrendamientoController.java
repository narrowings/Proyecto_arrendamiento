package com.apiweb.backend.Controller;

import org.springframework.http.HttpHeaders;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.apiweb.backend.Model.acuerdoArrendamientoModel;
import com.apiweb.backend.Service.IAcuerdoArrendamientoService;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(
  origins = "*",
  allowedHeaders = "*",
  methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS }
)
@RestController
@RequestMapping("/space/acuerdoArrendamiento")
public class AcuerdoArrendamientoController {

    @Autowired 
    private IAcuerdoArrendamientoService acuerdoArrendamientoService;
    @Autowired 
    private ObjectMapper objectMapper;

    @PostMapping(value = "/registrar", consumes = "multipart/form-data")
    public ResponseEntity<?> crearAcuerdoArrendamiento(
            @RequestPart("acuerdoArrendamiento") String json,
            @RequestPart("contratoPdf") MultipartFile pdf) {
        try {
            acuerdoArrendamientoModel dto = objectMapper.readValue(json, acuerdoArrendamientoModel.class);
            dto.setContratoPdf(pdf.getBytes());
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(acuerdoArrendamientoService.guardarAcuerdoArrendamiento(dto, pdf));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en la solicitud: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<acuerdoArrendamientoModel>> listar() {
        return ResponseEntity.ok(acuerdoArrendamientoService.listarAcuerdoArrendamientos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<acuerdoArrendamientoModel> getById(@PathVariable Integer id) {
        return acuerdoArrendamientoService.obtenerAcuerdoArrendamientoPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> actualizar(
        @PathVariable Integer id,
        @RequestPart("acuerdoArrendamiento") String json,
        @RequestPart(value="contratoPdf", required=false) MultipartFile pdf
    ) {
        try {
            acuerdoArrendamientoModel dto = objectMapper.readValue(json, acuerdoArrendamientoModel.class);
            return ResponseEntity.ok(
                acuerdoArrendamientoService.actualizarAcuerdo(id, dto, pdf)
            );
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("JSON inválido: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/calificar")
    public ResponseEntity<?> calificar(
        @PathVariable Integer id,
        @RequestBody Map<String, Object> updates
    ) {
        try {
            acuerdoArrendamientoModel e = acuerdoArrendamientoService
                .obtenerAcuerdoArrendamientoPorId(id)
                .orElseThrow(() -> new RuntimeException("Acuerdo no encontrado"));
            if (updates.containsKey("calificacionEspacio"))
                e.setCalificacionEspacio((Integer) updates.get("calificacionEspacio"));
            if (updates.containsKey("comentarioEspacio"))
                e.setComentarioEspacio((String) updates.get("comentarioEspacio"));
            if (updates.containsKey("calificacionUsuario"))
                e.setCalificacionUsuario((Integer) updates.get("calificacionUsuario"));
            if (updates.containsKey("comentarioUsuario"))
                e.setComentarioUsuario((String) updates.get("comentarioUsuario"));
            // Reutilizamos guardarAcuerdoArrendamiento para persistir
            return ResponseEntity.ok(acuerdoArrendamientoService.guardarAcuerdoArrendamiento(e, null));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (IOException ioe) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ioe.getMessage());
        }
    }

    @GetMapping("/descargar/{id}")
    public ResponseEntity<byte[]> descargar(@PathVariable Integer id) {
        Optional<acuerdoArrendamientoModel> opt = acuerdoArrendamientoService.obtenerAcuerdoArrendamientoPorId(id);
        if (opt.isEmpty() || opt.get().getContratoPdf() == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=acuerdo_" + id + ".pdf")
            .body(opt.get().getContratoPdf());
    }
}

package com.apiweb.backend.Controller;

import com.apiweb.backend.dto.AvisoDTO;
import com.apiweb.backend.Model.avisosModel;
import com.apiweb.backend.Model.espaciosModel;
import com.apiweb.backend.Service.IAvisosService;
import com.apiweb.backend.Service.IEspaciosService;
import com.apiweb.backend.Service.S3Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/space/avisos")
public class AvisosController {

    @Autowired private IAvisosService avisosService;
    @Autowired private IEspaciosService espaciosService;
    @Autowired private S3Service s3Service;
    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping(
        value    = "/registrar",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> crearAvisos(
            @RequestPart("aviso") String avisoJson,
            @RequestPart("imagenes") MultipartFile[] imagenes) {
        try {
            // 1) Parsear el JSON a tu modelo
            avisosModel aviso = mapper.readValue(avisoJson, avisosModel.class);

            // 2) Validar número de imágenes
            if (imagenes.length < 3 || imagenes.length > 5) {
                return ResponseEntity.badRequest()
                        .body("Debes subir entre 3 y 5 imágenes.");
            }

            // 3) Subir cada imagen y recopilar URLs
            List<String> urls = new ArrayList<>();
            for (MultipartFile img : imagenes) {
                String url = s3Service.subirArchivo(img);
                urls.add(url);
            }
            // 4) Guardar las URLs en el modelo
            aviso.setImagenes(String.join(",", urls));

            // 5) Persistir y devolver respuesta
            avisosService.guardarAvisos(aviso);
            return ResponseEntity.status(HttpStatus.CREATED)
                                .body("Aviso registrado exitosamente");
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest()
                                 .body("JSON inválido en el part 'aviso'.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al subir imágenes.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(ex.getMessage());
        }
    }
    
    @GetMapping("/listar")
    public ResponseEntity<List<AvisoDTO>> listarAvisos() {
        List<AvisoDTO> dtos = avisosService.listarAvisos()
            .stream()
            .map(av -> new AvisoDTO(av))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/mis")
    public ResponseEntity<List<AvisoDTO>> listarMisAvisos(Authentication auth) {
        String nombreUsuario = auth.getName();
        // 1) traemos sólo los espacios de este usuario
        List<espaciosModel> propios = espaciosService.listarPorUsuario(nombreUsuario);
        // 2) extraemos sus IDs
        Set<Integer> espacioIds = propios.stream()
            .map(esp -> esp.getIdEspacios())
            .collect(Collectors.toSet());
        // 3) buscamos avisos que tengan idEspacios en ese set
        List<avisosModel> avisos = avisosService.listarPorEspacios(espacioIds);
        // 4) convertimos a DTO
        List<AvisoDTO> dtos = avisos.stream()
            .map(av -> new AvisoDTO(av))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/eliminar/{idAvisos}")
    public ResponseEntity<String> eliminarAviso(@PathVariable Integer idAvisos) {
        try {
            avisosService.eliminarAviso(idAvisos);
            return ResponseEntity.ok("Aviso eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping(
      value    = "/editar/{idAviso}",
      consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> editarAviso(
        @PathVariable Integer idAviso,
        @RequestPart("aviso") String avisoJson,
        @RequestPart(value = "imagenes", required = false) MultipartFile[] imagenes
    ) {
        try {
            // 1) Parsear tu JSON directamente a tu entidad
            avisosModel avisoActualizado = mapper.readValue(avisoJson, avisosModel.class);

            // 2) Si llegan imágenes, súbelas y actualiza el campo URLs
            if (imagenes != null && imagenes.length > 0) {
                if (imagenes.length < 3 || imagenes.length > 5) {
                    return ResponseEntity
                      .badRequest()
                      .body("Debes subir entre 3 y 5 imágenes.");
                }
                List<String> urls = new ArrayList<>();
                for (MultipartFile img : imagenes) {
                    String url = s3Service.subirArchivo(img);
                    urls.add(url);
                }
                avisoActualizado.setImagenes(String.join(",", urls));
            }

            // 3) Llamar al servicio para actualizar
            avisosService.actualizarAviso(idAviso, avisoActualizado);
            return ResponseEntity.ok("El aviso fue editado correctamente");
        } catch (IOException e) {
            return ResponseEntity
              .status(HttpStatus.BAD_REQUEST)
              .body("JSON inválido en el part 'aviso': " + e.getMessage());
        } catch (RuntimeException ex) {
            return ResponseEntity
              .status(HttpStatus.NOT_FOUND)
              .body(ex.getMessage());
        }
    }

    @GetMapping("/{idAvisos}")
    public ResponseEntity<AvisoDTO> obtenerAvisoPorId(@PathVariable Integer idAvisos) {
        avisosModel aviso = avisosService.obtenerAvisoPorId(idAvisos);
        AvisoDTO dto = new AvisoDTO(aviso);
        return ResponseEntity.ok(dto);
    } 
}

package com.apiweb.backend.dto;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import com.apiweb.backend.Model.avisosModel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvisoDTO {
    private Integer idAvisos;
    private Integer idEspacios;
    private String titulo;
    private String descripcion;
    private Double precio;
    private String condicionesAdicionales;
    private String estado;
    private List<String> imagenes;
    private Integer propietarioId;
    private LocalDateTime creado;
    private LocalDateTime actualizado;

    /**
     * Constructor de conveniencia desde la entidad avisosModel,
     * mapea todos los campos y extrae propietarioId de espacios→usuario.
     */
    public AvisoDTO(avisosModel a) {
        this.idAvisos = a.getIdAvisos();
        this.idEspacios = a.getIdEspacios().getIdEspacios();
        this.titulo = a.getTitulo();
        this.descripcion = a.getDescripcion();
        this.precio = a.getPrecio();
        this.condicionesAdicionales = a.getCondicionesAdicionales();
        this.estado = a.getEstado();
        // parseamos la cadena de imágenes a lista
        this.imagenes = a.getImagenes() != null
            ? Arrays.stream(a.getImagenes().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList())
            : List.of();
        // extraemos el propietario
        this.propietarioId = a.getIdEspacios()
                              .getUsuario()
                              .getIdUsuarios();
        this.creado = a.getCreado();
        this.actualizado = a.getActualizado();
    }
}

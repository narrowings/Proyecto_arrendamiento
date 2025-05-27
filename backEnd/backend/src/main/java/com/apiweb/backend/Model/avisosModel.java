package com.apiweb.backend.Model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "avisos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class avisosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAvisos;
    @OneToOne(optional = false)
    @JoinColumn(name = "idEspacios", unique = true, nullable = false)
    private espaciosModel idEspacios;
    private String titulo;
    private String descripcion;
    private Double precio;
    private String condicionesAdicionales;
    private String imagenes;
    private String estado;
    @CreationTimestamp
    private LocalDateTime creado;
    @UpdateTimestamp
    private LocalDateTime actualizado;

    /** Este método añadirá campo propietarioId al JSON de salida **/
    @JsonProperty("propietarioId")
    public Integer getPropietarioId() {
        return idEspacios != null && idEspacios.getUsuario() != null
             ? idEspacios.getUsuario().getIdUsuarios()
             : null;
    }
}

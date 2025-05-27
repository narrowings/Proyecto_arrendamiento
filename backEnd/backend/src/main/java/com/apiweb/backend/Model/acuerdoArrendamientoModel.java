package com.apiweb.backend.Model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "acuerdoArrendamiento")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class acuerdoArrendamientoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAcuerdoArrendamiento;
     
    @ManyToOne
    @JoinColumn(name = "idEspacios")
    private espaciosModel idEspacios; 
    
    @ManyToOne
    @JoinColumn(name = "idUsuarios")
    private usuariosModel idUsuarios;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaInicio;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaFin;
    
    private String estado;
    
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    //@Column(name = "contratoPdf")
    private byte[] contratoPdf;
    
    private Integer calificacionEspacio;
    private String comentarioEspacio;
    private Integer calificacionUsuario;
    private String comentarioUsuario;
}

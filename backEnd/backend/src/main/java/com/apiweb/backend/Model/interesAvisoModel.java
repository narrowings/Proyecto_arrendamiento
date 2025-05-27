/*package com.apiweb.backend.Model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "interesAviso")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class interesAvisoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idInteresAviso;
    
    @ManyToOne
    @JoinColumn(name = "idUsuarios")
    private usuariosModel idUsuarios;
    
    @ManyToOne
    @JoinColumn(name = "idAvisos")
    private avisosModel idAvisos;
    
    private String mensaje;
    
    @CreationTimestamp
    private LocalDateTime creado;
}*/


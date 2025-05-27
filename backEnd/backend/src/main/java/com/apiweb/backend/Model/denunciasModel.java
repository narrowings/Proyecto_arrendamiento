package com.apiweb.backend.Model;

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
@Table(name = "denuncias")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class denunciasModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDenuncias;
    @ManyToOne
    @JoinColumn(name = "idAvisos")
    private avisosModel idAvisos;
    @ManyToOne
    @JoinColumn(name = "idUsuarios")
    private usuariosModel idUsuarios;
    private String razon;
    private String comentario;
    @CreationTimestamp 
    private LocalDateTime creado;
}

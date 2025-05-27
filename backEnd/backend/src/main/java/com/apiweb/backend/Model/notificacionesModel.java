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
@Table(name = "notificaciones")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class notificacionesModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idNotificaciones;
    
    @ManyToOne
    @JoinColumn(name = "idMensaje")
    private mensajeModel idMensaje;
    
    @ManyToOne
    @JoinColumn(name = "idAvisos")
    private avisosModel aviso;

    @ManyToOne
    @JoinColumn(name = "idUsuarios")
    private usuariosModel idUsuarios;
    
    private String descripcion;
    
    private Boolean leido;
    
    @CreationTimestamp
    private LocalDateTime creado;
}


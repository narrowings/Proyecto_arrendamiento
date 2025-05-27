package com.apiweb.backend.Model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "mensajes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class mensajeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idMensaje")
    private Integer idMensaje;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idConversacion")
    @JsonBackReference
    private conversacionModel conversacion;

    @ManyToOne
    @JoinColumn(name = "idUsuarios")
    private usuariosModel usuario;

    @Column(name = "contenido", length = 1000)
    private String contenido;

    @Column(name = "visto")
    private Boolean visto = false;

    @CreationTimestamp
    @Column(name = "creado")
    private LocalDateTime creado;
}

package com.apiweb.backend.Model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "conversaciones")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class conversacionModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idConversacion")
    private Integer idConversacion;

    @ManyToOne
    @JoinColumn(name = "idAvisos")
    private avisosModel aviso;

    @ManyToOne
    @JoinColumn(name = "idUsuarios")  
    private usuariosModel usuarioInteresado;

    @Column(name = "estado")
    private String estado;

    @CreationTimestamp
    @Column(name = "creado")
    private LocalDateTime creado;
    
    @OneToMany(mappedBy = "conversacion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<mensajeModel> mensajes;
}

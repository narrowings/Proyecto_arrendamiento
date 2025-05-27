package com.apiweb.backend.Model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class usuariosModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuarios;
    @Column(unique = true)
    private String email;
    @Column(unique = true)
    private String nombreUsuario;
    private String contrasena;
    private String telefono;
    private String palabraSecreta;
    private String rol;
    private String fotoPerfil;

    @Column(name = "verificationToken", length = 64)
    private String verificationToken;

    @Column(name = "tokenCreationDate")
    private LocalDateTime tokenCreationDate;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = false;

    @Column(name = "recoveryToken", length = 255)
    private String recoveryToken;

    @Column(name = "recoveryTokenCreationDate")
    private LocalDateTime recoveryTokenCreationDate;
}

package com.apiweb.backend.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
  name = "espacios",
  uniqueConstraints = {
    @UniqueConstraint(name = "ux_apto_por_tipo",       columnNames = {"tipo","apto"}),
    @UniqueConstraint(name = "ux_habitacion_por_tipo", columnNames = {"tipo","habitacion"}),
    @UniqueConstraint(name = "ux_numero_casa",         columnNames = {"numero_casa"}),
    @UniqueConstraint(name = "ux_parqueadero",         columnNames = {"parqueadero"}),
    @UniqueConstraint(name = "ux_bodega",              columnNames = {"bodega"})
  }
)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class espaciosModel {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idEspacios;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "idUsuarios", nullable = false)
  private usuariosModel usuario;

  @Column(nullable = false, length = 100)
  private String titulo; 

  @Column(nullable = false, columnDefinition = "ENUM('apartamento','casa','parqueadero','bodega','habitacion')")
  private String tipo;

  @Column(nullable = false)
  private Integer estrato;

  @Column(length = 50)
  private String torre;

  @Column(length = 50)
  private String apto;

  @Column(length = 50)
  private String habitacion;

  @Column(name = "numero_casa", length = 50)
  private String numeroCasa;

  @Column(length = 50)
  private String parqueadero;

  @Column(length = 50)
  private String bodega;
}

// src/main/java/com/apiweb/backend/Repository/IEspaciosRepository.java
package com.apiweb.backend.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.apiweb.backend.Model.espaciosModel;
import com.apiweb.backend.Model.usuariosModel;

public interface IEspaciosRepository extends JpaRepository<espaciosModel, Integer> {

    List<espaciosModel> findByUsuario(usuariosModel usuario);

    // Apartamento: chequea solo apto
    boolean existsByTipoAndAptoAndUsuario_IdUsuarios(
        String tipo, String apto, Integer usuarioId);

    // Habitación: chequea apto + habitacion
    boolean existsByTipoAndAptoAndHabitacionAndUsuario_IdUsuarios(
        String tipo, String apto, String habitacion, Integer usuarioId);

    boolean existsByTipoAndNumeroCasaAndUsuario_IdUsuarios(
        String tipo, String numeroCasa, Integer usuarioId);

    boolean existsByTipoAndParqueaderoAndUsuario_IdUsuarios(
        String tipo, String parqueadero, Integer usuarioId);

    boolean existsByTipoAndBodegaAndUsuario_IdUsuarios(
        String tipo, String bodega, Integer usuarioId);
}

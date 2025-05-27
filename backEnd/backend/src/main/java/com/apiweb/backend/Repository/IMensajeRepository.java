package com.apiweb.backend.Repository;

import com.apiweb.backend.Model.mensajeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IMensajeRepository extends JpaRepository<mensajeModel, Integer> {

    // Método para obtener mensajes por idConversacion ordenados por fecha ascendente
    List<mensajeModel> findByConversacionIdConversacionOrderByCreadoAsc(Integer idConversacion);
}
package com.apiweb.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apiweb.backend.Model.notificacionesModel;

public interface INotificacionesRepository extends JpaRepository<notificacionesModel, Integer> {
}

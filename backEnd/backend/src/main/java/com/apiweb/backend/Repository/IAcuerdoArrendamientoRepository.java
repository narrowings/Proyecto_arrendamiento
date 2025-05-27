package com.apiweb.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apiweb.backend.Model.acuerdoArrendamientoModel;

public interface IAcuerdoArrendamientoRepository extends JpaRepository<acuerdoArrendamientoModel, Integer> {

}
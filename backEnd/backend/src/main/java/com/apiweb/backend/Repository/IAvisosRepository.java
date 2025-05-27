package com.apiweb.backend.Repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apiweb.backend.Model.avisosModel;

public interface IAvisosRepository extends JpaRepository<avisosModel, Integer> {

    List<avisosModel> findByIdEspacios_IdEspaciosIn(Set<Integer> espacioIds);
    
}

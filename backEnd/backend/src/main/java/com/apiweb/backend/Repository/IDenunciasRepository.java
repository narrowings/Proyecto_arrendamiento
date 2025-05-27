package com.apiweb.backend.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.apiweb.backend.Model.denunciasModel;

public interface IDenunciasRepository extends JpaRepository<denunciasModel, Integer> {
    
    List<denunciasModel> findByIdAvisos_IdAvisos(Integer idAvisos);
}

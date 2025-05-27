package com.apiweb.backend.Repository;

import com.apiweb.backend.Model.conversacionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IConversacionRepository extends JpaRepository<conversacionModel, Integer> {

}

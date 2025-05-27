package com.apiweb.backend.Repository;

import com.apiweb.backend.Model.usuariosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IUsuariosRepository extends JpaRepository<usuariosModel, Integer> {
    boolean existsByNombreUsuario(String nombreUsuario);
    boolean existsByEmail(String email);
    Optional<usuariosModel> findByVerificationToken(String token); 
    Optional<usuariosModel> findByEmail(String email);
    Optional<usuariosModel> findByNombreUsuario(String nombreUsuario);
    Optional<usuariosModel> findByRecoveryToken(String token);
    
}

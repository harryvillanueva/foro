package com.daw.foro.usuario.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    // Spring Data crea automáticamente la consulta SQL para buscar por email
    Optional<UsuarioEntity> findByEmail(String email);
    java.util.List<UsuarioEntity> findByRol(com.daw.foro.usuario.domain.Rol rol);
}
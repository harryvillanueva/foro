package com.daw.foro.usuario.infrastructure;

import com.daw.foro.usuario.domain.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByEmail(String email);
    Optional<UsuarioEntity> findByNombre(String nombre);
    List<UsuarioEntity> findByRol(Rol rol);
}
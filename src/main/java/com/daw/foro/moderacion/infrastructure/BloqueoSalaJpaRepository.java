package com.daw.foro.moderacion.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BloqueoSalaJpaRepository extends JpaRepository<BloqueoSalaEntity, Long> {
    Optional<BloqueoSalaEntity> findByUsuarioIdAndSalaId(Long usuarioId, Long salaId);

    // NUEVO: Para borrar bloqueos al eliminar la sala
    void deleteBySalaId(Long salaId);
}
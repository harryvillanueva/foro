package com.daw.foro.sala.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SuscripcionJpaRepository extends JpaRepository<SuscripcionEntity, Long> {
    List<SuscripcionEntity> findByUsuarioId(Long usuarioId);
    List<SuscripcionEntity> findBySalaId(Long salaId);
    Optional<SuscripcionEntity> findByUsuarioIdAndSalaId(Long usuarioId, Long salaId);
    void deleteByUsuarioIdAndSalaId(Long usuarioId, Long salaId);

    // NUEVO: Para borrar suscripciones al eliminar la sala
    void deleteBySalaId(Long salaId);
}
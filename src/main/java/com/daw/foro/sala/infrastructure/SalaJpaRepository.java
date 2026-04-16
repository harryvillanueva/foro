package com.daw.foro.sala.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaJpaRepository extends JpaRepository<SalaEntity, Long> {
    long countByModeradorId(Long moderadorId);
    // Buscar todas las salas asignadas a un moderador específico
    java.util.List<SalaEntity> findByModeradorId(Long moderadorId);
}
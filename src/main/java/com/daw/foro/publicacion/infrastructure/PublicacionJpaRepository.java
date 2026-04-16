package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.domain.TipoPublicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicacionJpaRepository extends JpaRepository<PublicacionEntity, Long> {

    // Buscar preguntas de una sala
    List<PublicacionEntity> findBySalaIdAndTipoAndEstadoOrderByFechaCreacionDesc(Long salaId, TipoPublicacion tipo, EstadoPublicacion estado);

    // Buscar respuestas de una pregunta
    List<PublicacionEntity> findByPreguntaPadreIdAndEstadoOrderByFechaCreacionAsc(Long preguntaPadreId, EstadoPublicacion estado);

    // NUEVO: Contar cuántas respuestas tiene una pregunta específica
    long countByPreguntaPadreIdAndEstado(Long preguntaPadreId, EstadoPublicacion estado);

    // Buscar pendientes para el moderador
    List<PublicacionEntity> findBySalaIdAndEstadoOrderByFechaCreacionDesc(Long salaId, EstadoPublicacion estado);
}
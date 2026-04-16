package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.domain.TipoPublicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicacionJpaRepository extends JpaRepository<PublicacionEntity, Long> {
    // Magia de Spring Data: Buscar preguntas aprobadas de una sala ordenadas por la más reciente
    List<PublicacionEntity> findBySalaIdAndTipoAndEstadoOrderByFechaCreacionDesc(Long salaId, TipoPublicacion tipo, EstadoPublicacion estado);
}
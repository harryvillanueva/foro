package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.domain.TipoPublicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PublicacionJpaRepository extends JpaRepository<PublicacionEntity, Long> {
    List<PublicacionEntity> findBySalaIdAndTipoAndEstadoOrderByFechaCreacionDesc(Long salaId, TipoPublicacion tipo, EstadoPublicacion estado);
    List<PublicacionEntity> findByPreguntaPadreIdAndEstadoOrderByFechaCreacionAsc(Long preguntaPadreId, EstadoPublicacion estado);
    long countByPreguntaPadreIdAndEstado(Long preguntaPadreId, EstadoPublicacion estado);
    List<PublicacionEntity> findBySalaIdAndEstadoOrderByFechaCreacionDesc(Long salaId, EstadoPublicacion estado);
    List<PublicacionEntity> findByAutorIdOrderByFechaCreacionDesc(Long autorId);
    long countByAutorIdAndSalaIdAndTipoAndFechaCreacionAfter(Long autorId, Long salaId, TipoPublicacion tipo, LocalDateTime fecha);

    // NUEVO: Para borrar todas las publicaciones al eliminar la sala
    void deleteBySalaId(Long salaId);
}
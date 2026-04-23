package com.daw.foro.notificacion.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificacionJpaRepository extends JpaRepository<NotificacionEntity, Long> {
    List<NotificacionEntity> findByUsuarioDestinoIdOrderByFechaDesc(Long usuarioDestinoId);
}
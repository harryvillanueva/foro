package com.daw.foro.usuario.infrastructure;

import com.daw.foro.notificacion.infrastructure.NotificacionEntity;
import com.daw.foro.notificacion.infrastructure.NotificacionJpaRepository;
import com.daw.foro.publicacion.application.ListarHistorialUsuarioApp;
import com.daw.foro.publicacion.infrastructure.PublicacionEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    @Autowired private ListarHistorialUsuarioApp listarHistorialApp;
    @Autowired private NotificacionJpaRepository notiRepo;
    @Autowired private UsuarioJpaRepository userRepo;

    @GetMapping("/historial")
    public List<PublicacionEntity> miHistorial() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return listarHistorialApp.ejecutar(email);
    }

    @GetMapping("/notificaciones")
    public List<NotificacionEntity> misNotificaciones() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity user = userRepo.findByEmail(email).get();
        return notiRepo.findByUsuarioDestinoIdOrderByFechaDesc(user.getId());
    }
}
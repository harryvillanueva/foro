package com.daw.foro.notificacion.application;

import com.daw.foro.notificacion.infrastructure.NotificacionEntity;
import com.daw.foro.notificacion.infrastructure.NotificacionJpaRepository;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnviarNotificacionApp {

    @Autowired private NotificacionJpaRepository notificacionRepository;
    @Autowired private UsuarioJpaRepository usuarioRepository;

    public void ejecutar(String emailModerador, Long destinoId, String mensaje) {
        UsuarioEntity mod = usuarioRepository.findByEmail(emailModerador)
                .orElseThrow(() -> new RuntimeException("Moderador no encontrado"));

        NotificacionEntity noti = new NotificacionEntity(destinoId, mod.getId(), mod.getNombre(), mensaje);
        notificacionRepository.save(noti);
    }
}
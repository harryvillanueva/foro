package com.daw.foro.moderacion.application;

import com.daw.foro.moderacion.infrastructure.BloqueoSalaEntity;
import com.daw.foro.moderacion.infrastructure.BloqueoSalaJpaRepository;
import com.daw.foro.notificacion.infrastructure.NotificacionEntity;
import com.daw.foro.notificacion.infrastructure.NotificacionJpaRepository;
import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import com.daw.foro.usuario.domain.Rol;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ModeracionAvanzadaApp {

    @Autowired private BloqueoSalaJpaRepository bloqueoRepo;
    @Autowired private SalaJpaRepository salaRepo;
    @Autowired private NotificacionJpaRepository notiRepo;
    @Autowired private UsuarioJpaRepository userRepo;

    public void bloquearUsuario(String emailMod, Long usuarioId, Long salaId, int dias) {
        UsuarioEntity mod = userRepo.findByEmail(emailMod).orElseThrow();
        SalaEntity sala = salaRepo.findById(salaId).orElseThrow();

        BloqueoSalaEntity bloqueo = bloqueoRepo.findByUsuarioIdAndSalaId(usuarioId, salaId).orElse(new BloqueoSalaEntity());
        bloqueo.setUsuarioId(usuarioId);
        bloqueo.setSalaId(salaId);
        bloqueo.setFechaFin(dias == 0 ? null : LocalDateTime.now().plusDays(dias));
        bloqueoRepo.save(bloqueo);

        // AQUÍ GENERAMOS LA NOTIFICACIÓN AUTOMÁTICA AL PERFIL DEL USUARIO
        String duracion = (dias == 0) ? "PERMANENTEMENTE" : ("temporalmente por " + dias + " días");
        String mensaje = "Has sido expulsado de la sala '" + sala.getNombre() + "' " + duracion + " por infringir las normas.";
        notiRepo.save(new NotificacionEntity(usuarioId, mod.getId(), mod.getNombre(), mensaje));
    }

    public void fijarLimite(Long salaId, int limite) {
        SalaEntity sala = salaRepo.findById(salaId).orElseThrow();
        sala.setLimitePreguntasSemana(limite);
        salaRepo.save(sala);
    }

    public void solicitarBaja(String emailMod, Long usuarioProblematicoId) {
        UsuarioEntity mod = userRepo.findByEmail(emailMod).orElseThrow();
        UsuarioEntity problem = userRepo.findById(usuarioProblematicoId).orElseThrow();

        List<UsuarioEntity> admins = userRepo.findByRol(Rol.SUPERADMIN);
        for(UsuarioEntity admin : admins) {
            String msg = "¡URGENTE! Solicitud de baja/baneo global para el usuario '" + problem.getNombre() + "' (" + problem.getEmail() + ") solicitada por reincidencia.";
            notiRepo.save(new NotificacionEntity(admin.getId(), mod.getId(), mod.getNombre(), msg));
        }
    }
}
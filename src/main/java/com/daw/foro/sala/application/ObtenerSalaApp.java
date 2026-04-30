package com.daw.foro.sala.application;

import com.daw.foro.moderacion.infrastructure.BloqueoSalaEntity;
import com.daw.foro.moderacion.infrastructure.BloqueoSalaJpaRepository;
import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ObtenerSalaApp {

    @Autowired private SalaJpaRepository salaRepository;
    @Autowired private BloqueoSalaJpaRepository bloqueoRepository;
    @Autowired private UsuarioJpaRepository usuarioRepository;

    public SalaEntity ejecutar(Long id, String emailUsuario) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Optional<BloqueoSalaEntity> bloqueoOpt = bloqueoRepository.findByUsuarioIdAndSalaId(usuario.getId(), id);

        if (bloqueoOpt.isPresent()) {
            BloqueoSalaEntity bloqueo = bloqueoOpt.get();
            if (bloqueo.getFechaFin() == null) {
                throw new RuntimeException("❌ ACCESO DENEGADO: Has sido bloqueado de forma PERMANENTE de esta sala por moderación.");
            } else if (bloqueo.getFechaFin().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("❌ ACCESO DENEGADO: Estás bloqueado temporalmente de esta sala. Podrás volver a entrar el: " + bloqueo.getFechaFin().toLocalDate());
            }
        }

        return salaRepository.findById(id).orElseThrow(() -> new RuntimeException("Sala no encontrada"));
    }
}
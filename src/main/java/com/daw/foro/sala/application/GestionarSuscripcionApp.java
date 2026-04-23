package com.daw.foro.sala.application;

import com.daw.foro.sala.infrastructure.SuscripcionEntity;
import com.daw.foro.sala.infrastructure.SuscripcionJpaRepository;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GestionarSuscripcionApp {

    @Autowired private SuscripcionJpaRepository suscripcionRepository;
    @Autowired private UsuarioJpaRepository usuarioRepository;

    public void suscribir(String email, Long salaId) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (suscripcionRepository.findByUsuarioIdAndSalaId(usuario.getId(), salaId).isEmpty()) {
            suscripcionRepository.save(new SuscripcionEntity(usuario.getId(), salaId));
        }
    }

    @Transactional
    public void desuscribir(String email, Long salaId) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        suscripcionRepository.deleteByUsuarioIdAndSalaId(usuario.getId(), salaId);
    }

    public void toggleFavorito(String email, Long salaId) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        SuscripcionEntity sub = suscripcionRepository.findByUsuarioIdAndSalaId(usuario.getId(), salaId)
                .orElseThrow(() -> new RuntimeException("No estás suscrito a esta sala"));

        sub.setEsFavorita(!sub.isEsFavorita());
        suscripcionRepository.save(sub);
    }

    public List<SuscripcionEntity> listarMisSuscripciones(String email) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return suscripcionRepository.findByUsuarioId(usuario.getId());
    }
}
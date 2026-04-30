package com.daw.foro.sala.application;

import com.daw.foro.moderacion.infrastructure.BloqueoSalaJpaRepository;
import com.daw.foro.publicacion.infrastructure.PublicacionJpaRepository;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import com.daw.foro.sala.infrastructure.SuscripcionJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EliminarSalaApp {

    @Autowired private SalaJpaRepository salaRepository;
    @Autowired private PublicacionJpaRepository publicacionRepository;
    @Autowired private SuscripcionJpaRepository suscripcionRepository;
    @Autowired private BloqueoSalaJpaRepository bloqueoRepository;

    @Transactional
    public void ejecutar(Long salaId) {
        if (!salaRepository.existsById(salaId)) {
            throw new RuntimeException("La sala no existe o ya fue eliminada.");
        }

        publicacionRepository.deleteBySalaId(salaId);
        suscripcionRepository.deleteBySalaId(salaId);
        bloqueoRepository.deleteBySalaId(salaId);
        salaRepository.deleteById(salaId);
    }
}
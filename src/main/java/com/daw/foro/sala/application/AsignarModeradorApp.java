package com.daw.foro.sala.application;

import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AsignarModeradorApp {

    @Autowired private SalaJpaRepository salaRepository;

    public void ejecutar(Long salaId, Long moderadorId) {
        Optional<SalaEntity> salaOpt = salaRepository.findById(salaId);
        if (salaOpt.isEmpty()) throw new RuntimeException("La sala no existe.");

        long salasAsignadas = salaRepository.countByModeradorId(moderadorId);
        if (salasAsignadas >= 2) {
            throw new RuntimeException("Este moderador ya ha alcanzado el límite máximo de 2 salas.");
        }

        SalaEntity sala = salaOpt.get();
        sala.setModeradorId(moderadorId);
        salaRepository.save(sala);
    }

    // NUEVO MÉTODO
    public void remover(Long salaId) {
        SalaEntity sala = salaRepository.findById(salaId)
                .orElseThrow(() -> new RuntimeException("La sala no existe."));
        sala.setModeradorId(null);
        salaRepository.save(sala);
    }
}
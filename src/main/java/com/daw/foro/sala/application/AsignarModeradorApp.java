package com.daw.foro.sala.application;

import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AsignarModeradorApp {

    @Autowired
    private SalaJpaRepository salaRepository;

    public void ejecutar(Long salaId, Long moderadorId) {
        // 1. Verificar si la sala existe
        Optional<SalaEntity> salaOpt = salaRepository.findById(salaId);
        if (salaOpt.isEmpty()) throw new RuntimeException("La sala no existe.");

        // 2. Regla de Negocio: Máximo 2 salas por moderador
        long salasAsignadas = salaRepository.countByModeradorId(moderadorId);
        if (salasAsignadas >= 2) {
            throw new RuntimeException("Este moderador ya ha alcanzado el límite máximo de 2 salas.");
        }

        // 3. Asignar y guardar
        SalaEntity sala = salaOpt.get();
        sala.setModeradorId(moderadorId);
        salaRepository.save(sala);
    }
}
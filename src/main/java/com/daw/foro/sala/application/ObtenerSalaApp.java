package com.daw.foro.sala.application;

import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ObtenerSalaApp {
    @Autowired private SalaJpaRepository salaRepository;
    public SalaEntity ejecutar(Long id) {
        return salaRepository.findById(id).orElseThrow(() -> new RuntimeException("Sala no encontrada"));
    }
}
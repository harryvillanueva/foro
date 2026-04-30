package com.daw.foro.sala.application;

import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrearSalaApp {

    @Autowired
    private SalaJpaRepository salaRepository;

    public void ejecutar(String nombre, String tematica, boolean requiereModeracion) {
        SalaEntity nuevaSala = new SalaEntity(nombre, tematica, requiereModeracion);
        salaRepository.save(nuevaSala);
    }
}
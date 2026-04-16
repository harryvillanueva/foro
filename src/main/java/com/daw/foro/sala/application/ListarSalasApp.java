package com.daw.foro.sala.application;

import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListarSalasApp {

    @Autowired
    private SalaJpaRepository salaRepository;

    public List<SalaEntity> ejecutar() {
        return salaRepository.findAll();
    }
}
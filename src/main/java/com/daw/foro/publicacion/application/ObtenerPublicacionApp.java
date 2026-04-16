package com.daw.foro.publicacion.application;

import com.daw.foro.publicacion.infrastructure.PublicacionEntity;
import com.daw.foro.publicacion.infrastructure.PublicacionJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ObtenerPublicacionApp {
    @Autowired private PublicacionJpaRepository repository;

    public PublicacionEntity ejecutar(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
    }
}
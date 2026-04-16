package com.daw.foro.publicacion.application;

import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.infrastructure.PublicacionEntity;
import com.daw.foro.publicacion.infrastructure.PublicacionJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CambiarEstadoPublicacionApp {
    @Autowired private PublicacionJpaRepository repository;

    public void ejecutar(Long publicacionId, String nuevoEstado) {
        PublicacionEntity pub = repository.findById(publicacionId)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));

        pub.setEstado(EstadoPublicacion.valueOf(nuevoEstado.toUpperCase()));
        repository.save(pub);
    }
}
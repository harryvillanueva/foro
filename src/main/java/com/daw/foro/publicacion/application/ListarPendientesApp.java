package com.daw.foro.publicacion.application;

import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.infrastructure.PublicacionEntity;
import com.daw.foro.publicacion.infrastructure.PublicacionJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListarPendientesApp {
    @Autowired private PublicacionJpaRepository repository;

    public List<PublicacionEntity> ejecutar(Long salaId) {
        return repository.findBySalaIdAndEstadoOrderByFechaCreacionDesc(salaId, EstadoPublicacion.PENDIENTE);
    }
}
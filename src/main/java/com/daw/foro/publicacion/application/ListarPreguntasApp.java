package com.daw.foro.publicacion.application;

import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.domain.TipoPublicacion;
import com.daw.foro.publicacion.infrastructure.PublicacionEntity;
import com.daw.foro.publicacion.infrastructure.PublicacionJpaRepository;
import com.daw.foro.publicacion.infrastructure.dto.PreguntaResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ListarPreguntasApp {

    @Autowired
    private PublicacionJpaRepository repository;

    // Fíjate que ahora devolvemos el DTO, no la Entidad
    public List<PreguntaResponseDTO> ejecutar(Long salaId) {

        // 1. Buscamos las preguntas aprobadas
        List<PublicacionEntity> preguntas = repository.findBySalaIdAndTipoAndEstadoOrderByFechaCreacionDesc(
                salaId, TipoPublicacion.PREGUNTA, EstadoPublicacion.APROBADA);

        List<PreguntaResponseDTO> resultado = new ArrayList<>();

        // 2. Por cada pregunta, armamos el DTO y contamos sus respuestas
        for (PublicacionEntity p : preguntas) {
            PreguntaResponseDTO dto = new PreguntaResponseDTO();
            dto.setId(p.getId());
            dto.setContenido(p.getContenido());
            dto.setAutorNombre(p.getAutorNombre());
            dto.setFechaCreacion(p.getFechaCreacion());

            // ¡MAGIA! Contamos las respuestas aprobadas que apuntan a esta pregunta
            long respuestas = repository.countByPreguntaPadreIdAndEstado(p.getId(), EstadoPublicacion.APROBADA);
            dto.setCantidadRespuestas(respuestas);

            resultado.add(dto);
        }

        return resultado;
    }
}
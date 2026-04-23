package com.daw.foro.publicacion.application;

import com.daw.foro.moderacion.infrastructure.BloqueoSalaEntity;
import com.daw.foro.moderacion.infrastructure.BloqueoSalaJpaRepository;
import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.domain.TipoPublicacion;
import com.daw.foro.publicacion.infrastructure.PublicacionEntity;
import com.daw.foro.publicacion.infrastructure.PublicacionJpaRepository;
import com.daw.foro.sala.infrastructure.SalaEntity;
import com.daw.foro.sala.infrastructure.SalaJpaRepository;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PublicarApp {

    @Autowired private PublicacionJpaRepository publicacionRepository;
    @Autowired private SalaJpaRepository salaRepository;
    @Autowired private UsuarioJpaRepository usuarioRepository;
    @Autowired private BloqueoSalaJpaRepository bloqueoRepository;

    public void ejecutar(String emailAutor, Long salaId, String contenido, Long preguntaPadreId) {
        UsuarioEntity autor = usuarioRepository.findByEmail(emailAutor).orElseThrow(() -> new RuntimeException("Usuario no válido"));
        SalaEntity sala = salaRepository.findById(salaId).orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        // 1. REGLA DE BLOQUEO: ¿Está expulsado de esta sala?
        Optional<BloqueoSalaEntity> bloqueoOpt = bloqueoRepository.findByUsuarioIdAndSalaId(autor.getId(), salaId);
        if (bloqueoOpt.isPresent()) {
            BloqueoSalaEntity bloqueo = bloqueoOpt.get();
            // Si la fecha es null (permanente) o es en el futuro (aún bloqueado)
            if (bloqueo.getFechaFin() == null || bloqueo.getFechaFin().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Tienes prohibido el acceso para publicar en esta sala por decisión de la moderación.");
            }
        }

        TipoPublicacion tipo = (preguntaPadreId == null) ? TipoPublicacion.PREGUNTA : TipoPublicacion.RESPUESTA;

        // 2. REGLA DE LÍMITE SEMANAL (Solo aplica a las preguntas, no a las respuestas)
        if (tipo == TipoPublicacion.PREGUNTA && sala.getLimitePreguntasSemana() > 0) {
            LocalDateTime haceUnaSemana = LocalDateTime.now().minusDays(7);
            long hechas = publicacionRepository.countByAutorIdAndSalaIdAndTipoAndFechaCreacionAfter(
                    autor.getId(), salaId, TipoPublicacion.PREGUNTA, haceUnaSemana);

            if (hechas >= sala.getLimitePreguntasSemana()) {
                throw new RuntimeException("Has alcanzado el límite semanal de " + sala.getLimitePreguntasSemana() + " preguntas en esta sala.");
            }
        }

        EstadoPublicacion estado = sala.isRequiereModeracion() ? EstadoPublicacion.PENDIENTE : EstadoPublicacion.APROBADA;
        PublicacionEntity publicacion = new PublicacionEntity(contenido, autor.getId(), autor.getNombre(), sala.getId(), preguntaPadreId, tipo, estado);
        publicacionRepository.save(publicacion);
    }
}
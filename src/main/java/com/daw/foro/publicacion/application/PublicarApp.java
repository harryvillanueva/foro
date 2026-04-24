package com.daw.foro.publicacion.application;

import com.daw.foro.moderacion.infrastructure.BloqueoSalaEntity;
import com.daw.foro.moderacion.infrastructure.BloqueoSalaJpaRepository;
import com.daw.foro.notificacion.infrastructure.NotificacionEntity;
import com.daw.foro.notificacion.infrastructure.NotificacionJpaRepository;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PublicarApp {

    @Autowired private PublicacionJpaRepository publicacionRepository;
    @Autowired private SalaJpaRepository salaRepository;
    @Autowired private UsuarioJpaRepository usuarioRepository;
    @Autowired private BloqueoSalaJpaRepository bloqueoRepository;
    @Autowired private NotificacionJpaRepository notificacionRepository; // NUEVO

    public void ejecutar(String emailAutor, Long salaId, String contenido, Long preguntaPadreId) {
        UsuarioEntity autor = usuarioRepository.findByEmail(emailAutor).orElseThrow(() -> new RuntimeException("Usuario no válido"));
        SalaEntity sala = salaRepository.findById(salaId).orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        // 1. REGLA DE BLOQUEO
        Optional<BloqueoSalaEntity> bloqueoOpt = bloqueoRepository.findByUsuarioIdAndSalaId(autor.getId(), salaId);
        if (bloqueoOpt.isPresent()) {
            BloqueoSalaEntity bloqueo = bloqueoOpt.get();
            if (bloqueo.getFechaFin() == null || bloqueo.getFechaFin().isAfter(LocalDateTime.now())) {
                throw new RuntimeException("Tienes prohibido el acceso para publicar en esta sala por decisión de la moderación.");
            }
        }

        TipoPublicacion tipo = (preguntaPadreId == null) ? TipoPublicacion.PREGUNTA : TipoPublicacion.RESPUESTA;

        // 2. REGLA DE LÍMITE SEMANAL
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

        // Guardamos la publicación
        publicacionRepository.save(publicacion);

        // 3. MAGIA NUEVA: PROCESAR MENCIONES (@usuario)
        procesarMenciones(contenido, autor, sala);
    }

    // MÉTODO ESCÁNER DE MENCIONES
    private void procesarMenciones(String contenido, UsuarioEntity autor, SalaEntity sala) {
        // Regex: Busca la arroba '@' seguida de letras, números o guiones bajos
        Pattern pattern = Pattern.compile("@([a-zA-Z0-9_]+)");
        Matcher matcher = pattern.matcher(contenido);

        while (matcher.find()) {
            String nombreMencionado = matcher.group(1);

            // Evitamos auto-menciones (que alguien se mencione a sí mismo para hacer spam)
            if (nombreMencionado.equalsIgnoreCase(autor.getNombre())) continue;

            // Buscamos si existe ese usuario en la Base de Datos
            Optional<UsuarioEntity> mencionadoOpt = usuarioRepository.findByNombre(nombreMencionado);
            if (mencionadoOpt.isPresent()) {
                UsuarioEntity mencionado = mencionadoOpt.get();

                // Le enviamos la notificación
                String mensaje = "¡El usuario '" + autor.getNombre() + "' te ha mencionado en la sala '" + sala.getNombre() + "'!";
                notificacionRepository.save(new NotificacionEntity(mencionado.getId(), autor.getId(), "Foro (Mención Automática)", mensaje));
            }
        }
    }
}
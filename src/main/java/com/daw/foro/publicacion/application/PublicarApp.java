package com.daw.foro.publicacion.application;

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

@Service
public class PublicarApp {

    @Autowired private PublicacionJpaRepository publicacionRepository;
    @Autowired private SalaJpaRepository salaRepository;
    @Autowired private UsuarioJpaRepository usuarioRepository;

    public void ejecutar(String emailAutor, Long salaId, String contenido, Long preguntaPadreId) {
        // 1. Buscamos al autor usando el email que nos dará el JWT
        UsuarioEntity autor = usuarioRepository.findByEmail(emailAutor).orElseThrow(() -> new RuntimeException("Usuario no válido"));

        // 2. Buscamos la sala
        SalaEntity sala = salaRepository.findById(salaId).orElseThrow(() -> new RuntimeException("Sala no encontrada"));

        // 3. Reglas de negocio puras
        EstadoPublicacion estado = sala.isRequiereModeracion() ? EstadoPublicacion.PENDIENTE : EstadoPublicacion.APROBADA;
        TipoPublicacion tipo = (preguntaPadreId == null) ? TipoPublicacion.PREGUNTA : TipoPublicacion.RESPUESTA;

        // 4. Guardamos
        PublicacionEntity publicacion = new PublicacionEntity(contenido, autor.getId(), autor.getNombre(), sala.getId(), preguntaPadreId, tipo, estado);
        publicacionRepository.save(publicacion);
    }
}
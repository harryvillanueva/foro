package com.daw.foro.publicacion.application;

import com.daw.foro.publicacion.infrastructure.PublicacionEntity;
import com.daw.foro.publicacion.infrastructure.PublicacionJpaRepository;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListarHistorialUsuarioApp {
    @Autowired private PublicacionJpaRepository publicacionRepository;
    @Autowired private UsuarioJpaRepository usuarioRepository;

    public List<PublicacionEntity> ejecutar(String email) {
        UsuarioEntity user = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // Asumiendo que el repositorio tiene este método:
        return publicacionRepository.findByAutorIdOrderByFechaCreacionDesc(user.getId());
    }
}
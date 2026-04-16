package com.daw.foro.usuario.application;

import com.daw.foro.usuario.domain.Rol;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ListarModeradoresApp {
    @Autowired
    private UsuarioJpaRepository usuarioRepository;

    public List<UsuarioEntity> ejecutar() {
        return usuarioRepository.findByRol(Rol.MODERADOR);
    }
}
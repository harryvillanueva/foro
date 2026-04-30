package com.daw.foro.usuario.application;

import com.daw.foro.usuario.domain.Rol;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegistrarModeradorApp {

    @Autowired
    private UsuarioJpaRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void ejecutar(String nombre, String email, String passwordPlana) {
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("El email ya está registrado.");
        }
        UsuarioEntity nuevoMod = new UsuarioEntity(nombre, email, passwordEncoder.encode(passwordPlana), Rol.MODERADOR);
        usuarioRepository.save(nuevoMod);
    }
}
package com.daw.foro.usuario.application;

import com.daw.foro.shared.infrastructure.JwtService;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AutenticarUsuarioApp {

    @Autowired private UsuarioJpaRepository usuarioRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtService jwtService;

    public String ejecutar(String email, String password) {
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // REGLA DE BANEO GLOBAL
        if (!usuario.isActivo()) {
            throw new RuntimeException("Tu cuenta ha sido DESACTIVADA permanentemente por la administración del foro.");
        }

        if (passwordEncoder.matches(password, usuario.getPassword())) {
            return jwtService.generarToken(usuario.getEmail(), usuario.getRol().name());
        } else {
            throw new RuntimeException("Credenciales inválidas");
        }
    }
}
package com.daw.foro.usuario.application;

import com.daw.foro.shared.infrastructure.JwtService;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AutenticarUsuarioApp {

    @Autowired
    private UsuarioJpaRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // Retorna el Token JWT si el login es exitoso
    public String ejecutar(String email, String passwordPlana) {

        // 1. Buscamos al usuario por email
        Optional<UsuarioEntity> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Credenciales inválidas"); // Email no existe
        }

        UsuarioEntity usuario = usuarioOpt.get();

        // 2. Comparamos la contraseña plana con el hash de la BD
        if (!passwordEncoder.matches(passwordPlana, usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas"); // Contraseña incorrecta
        }

        // 3. Si todo es correcto, generamos y devolvemos el token
        return jwtService.generarToken(usuario.getEmail(), usuario.getRol().name());
    }
}
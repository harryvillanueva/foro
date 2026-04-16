package com.daw.foro.usuario.application;

import com.daw.foro.usuario.domain.Rol;
import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegistrarParticipanteApp {

    @Autowired
    private UsuarioJpaRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Usaremos unas clases DTO simples (puedes crearlas en un archivo aparte o usarlas aquí)
    public void ejecutar(String nombre, String email, String passwordPlana) {

        // 1. Validar si el email ya existe
        if (usuarioRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("El email ya está registrado en el foro.");
        }

        // 2. Encriptar la contraseña (¡NUNCA guardar en texto plano!)
        String passwordEncriptada = passwordEncoder.encode(passwordPlana);

        // 3. Crear la entidad de base de datos asignando el rol por defecto: PARTICIPANTE
        UsuarioEntity nuevoUsuario = new UsuarioEntity(
                nombre,
                email,
                passwordEncriptada,
                Rol.PARTICIPANTE // Regla de negocio: Auto-registro siempre es Participante
        );

        // 4. Guardar en MySQL
        usuarioRepository.save(nuevoUsuario);
    }
}
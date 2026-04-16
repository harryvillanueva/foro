package com.daw.foro.usuario.infrastructure;

import com.daw.foro.usuario.application.AutenticarUsuarioApp;
import com.daw.foro.usuario.infrastructure.dto.LoginRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private AutenticarUsuarioApp autenticarUsuarioApp;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO request) {
        try {
            String token = autenticarUsuarioApp.ejecutar(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            // Devolvemos 401 Unauthorized si las credenciales son incorrectas
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
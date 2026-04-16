package com.daw.foro.usuario.infrastructure;

import com.daw.foro.usuario.application.RegistrarParticipanteApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private RegistrarParticipanteApp registrarParticipanteApp;

    // DTO interno para recibir el JSON
    public static class RegistroRequest {
        private String nombre;
        private String email;
        private String password;

        // Getters y Setters
        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@RequestBody RegistroRequest request) {
        try {
            registrarParticipanteApp.ejecutar(
                    request.getNombre(),
                    request.getEmail(),
                    request.getPassword()
            );
            return ResponseEntity.ok("Participante registrado con éxito. ¡Bienvenido al Foro!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
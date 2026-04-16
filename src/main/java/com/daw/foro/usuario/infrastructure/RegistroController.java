package com.daw.foro.usuario.infrastructure;

import com.daw.foro.usuario.application.RegistrarParticipanteApp;
import com.daw.foro.usuario.infrastructure.dto.RegistroRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class RegistroController {

    @Autowired
    private RegistrarParticipanteApp registrarParticipanteApp;

    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@RequestBody RegistroRequestDTO request) {
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
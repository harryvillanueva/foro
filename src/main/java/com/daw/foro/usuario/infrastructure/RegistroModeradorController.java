package com.daw.foro.usuario.infrastructure;

import com.daw.foro.usuario.application.RegistrarModeradorApp;
import com.daw.foro.usuario.infrastructure.dto.RegistroModeradorRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/moderadores")
public class RegistroModeradorController {

    @Autowired
    private RegistrarModeradorApp registrarModeradorApp;

    @PostMapping("/registro")
    public ResponseEntity<String> registrar(@RequestBody RegistroModeradorRequestDTO dto) {
        try {
            registrarModeradorApp.ejecutar(dto.getNombre(), dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok("Moderador registrado exitosamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
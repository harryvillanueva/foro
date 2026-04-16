package com.daw.foro.sala.infrastructure;

import com.daw.foro.sala.application.AsignarModeradorApp;
import com.daw.foro.sala.infrastructure.dto.AsignarModeradorRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salas/admin")
public class AsignarModeradorController {

    @Autowired
    private AsignarModeradorApp asignarModeradorApp;

    @PostMapping("/asignar-moderador")
    public ResponseEntity<String> asignar(@RequestBody AsignarModeradorRequestDTO dto) {
        try {
            asignarModeradorApp.ejecutar(dto.getSalaId(), dto.getModeradorId());
            return ResponseEntity.ok("Moderador asignado a la sala con éxito.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
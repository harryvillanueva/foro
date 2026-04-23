package com.daw.foro.sala.infrastructure;

import com.daw.foro.sala.application.EliminarSalaApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salas/admin")
public class EliminarSalaController {

    @Autowired private EliminarSalaApp eliminarSalaApp;

    @DeleteMapping("/eliminar/{salaId}")
    public ResponseEntity<String> eliminar(@PathVariable Long salaId) {
        try {
            eliminarSalaApp.ejecutar(salaId);
            return ResponseEntity.ok("Sala y todos sus datos eliminados permanentemente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
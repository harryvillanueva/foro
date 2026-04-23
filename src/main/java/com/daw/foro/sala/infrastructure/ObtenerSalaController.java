package com.daw.foro.sala.infrastructure;

import com.daw.foro.sala.application.ObtenerSalaApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salas")
public class ObtenerSalaController {

    @Autowired private ObtenerSalaApp obtenerSalaApp;

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            // Pasamos el email del usuario logueado para que el backend evalúe si tiene acceso
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            return ResponseEntity.ok(obtenerSalaApp.ejecutar(id, email));
        } catch (RuntimeException e) {
            // Si salta el error de bloqueo, devolvemos un 403 Forbidden
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
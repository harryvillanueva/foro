package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.application.CambiarEstadoPublicacionApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moderacion")
public class ModerarPublicacionController {
    @Autowired private CambiarEstadoPublicacionApp cambiarEstadoApp;

    @PostMapping("/publicacion/{id}/estado")
    public ResponseEntity<String> moderar(@PathVariable Long id, @RequestParam String nuevoEstado) {
        try {
            cambiarEstadoApp.ejecutar(id, nuevoEstado);
            return ResponseEntity.ok("Publicación actualizada a: " + nuevoEstado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
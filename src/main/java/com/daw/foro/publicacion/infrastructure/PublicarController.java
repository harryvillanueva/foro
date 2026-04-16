package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.application.PublicarApp;
import com.daw.foro.publicacion.infrastructure.dto.PublicarRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/publicaciones")
public class PublicarController {

    @Autowired private PublicarApp publicarApp;

    @PostMapping
    public ResponseEntity<String> publicar(@RequestBody PublicarRequestDTO dto) {
        try {
            // Extraemos el email del usuario logueado automáticamente desde el token JWT interceptado
            String emailAutor = SecurityContextHolder.getContext().getAuthentication().getName();
            publicarApp.ejecutar(emailAutor, dto.getSalaId(), dto.getContenido(), dto.getPreguntaPadreId());
            return ResponseEntity.ok("Publicación procesada correctamente.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
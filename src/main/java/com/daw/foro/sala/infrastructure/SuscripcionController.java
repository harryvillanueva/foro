package com.daw.foro.sala.infrastructure;

import com.daw.foro.sala.application.GestionarSuscripcionApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suscripciones")
public class SuscripcionController {

    @Autowired private GestionarSuscripcionApp gestionarSuscripcionApp;

    private String getEmailUsuarioLogueado() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/sala/{salaId}")
    public ResponseEntity<String> suscribir(@PathVariable Long salaId) {
        gestionarSuscripcionApp.suscribir(getEmailUsuarioLogueado(), salaId);
        return ResponseEntity.ok("Suscrito correctamente");
    }

    @DeleteMapping("/sala/{salaId}")
    public ResponseEntity<String> desuscribir(@PathVariable Long salaId) {
        gestionarSuscripcionApp.desuscribir(getEmailUsuarioLogueado(), salaId);
        return ResponseEntity.ok("Suscripción cancelada");
    }

    @PostMapping("/sala/{salaId}/favorito")
    public ResponseEntity<String> toggleFavorito(@PathVariable Long salaId) {
        gestionarSuscripcionApp.toggleFavorito(getEmailUsuarioLogueado(), salaId);
        return ResponseEntity.ok("Preferencia de favorito actualizada");
    }

    @GetMapping("/mis-suscripciones")
    public List<SuscripcionEntity> listar() {
        return gestionarSuscripcionApp.listarMisSuscripciones(getEmailUsuarioLogueado());
    }
}
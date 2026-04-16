package com.daw.foro.sala.infrastructure;

import com.daw.foro.sala.application.CrearSalaApp;
import com.daw.foro.sala.infrastructure.dto.CrearSalaRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salas/admin")
public class CrearSalaController {

    @Autowired
    private CrearSalaApp crearSalaApp;

    @PostMapping("/crear")
    public ResponseEntity<String> crear(@RequestBody CrearSalaRequestDTO dto) {
        try {
            crearSalaApp.ejecutar(dto.getNombre(), dto.getTematica(), dto.isRequiereModeracion());
            return ResponseEntity.ok("Sala creada exitosamente por el Administrador.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear la sala: " + e.getMessage());
        }
    }
}
package com.daw.foro.sala.infrastructure;

import com.daw.foro.sala.application.ObtenerSalaApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/salas")
public class ObtenerSalaController {
    @Autowired private ObtenerSalaApp obtenerSalaApp;

    @GetMapping("/{id}")
    public SalaEntity obtener(@PathVariable Long id) {
        return obtenerSalaApp.ejecutar(id);
    }
}
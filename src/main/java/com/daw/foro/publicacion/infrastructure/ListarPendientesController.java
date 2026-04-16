package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.application.ListarPendientesApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/moderacion")
public class ListarPendientesController {
    @Autowired private ListarPendientesApp listarPendientesApp;

    @GetMapping("/sala/{salaId}/pendientes")
    public List<PublicacionEntity> listar(@PathVariable Long salaId) {
        return listarPendientesApp.ejecutar(salaId);
    }
}
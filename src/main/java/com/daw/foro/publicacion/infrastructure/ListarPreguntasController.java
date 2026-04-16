package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.application.ListarPreguntasApp;
import com.daw.foro.publicacion.infrastructure.dto.PreguntaResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
public class ListarPreguntasController {

    @Autowired
    private ListarPreguntasApp listarPreguntasApp;

    @GetMapping("/sala/{salaId}/preguntas")
    public List<PreguntaResponseDTO> listar(@PathVariable Long salaId) {
        return listarPreguntasApp.ejecutar(salaId);
    }
}
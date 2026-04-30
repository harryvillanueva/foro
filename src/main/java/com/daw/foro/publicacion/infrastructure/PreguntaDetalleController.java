package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.application.ListarRespuestasApp;
import com.daw.foro.publicacion.application.ObtenerPublicacionApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/publicaciones")
public class PreguntaDetalleController {

    @Autowired private ObtenerPublicacionApp obtenerPublicacionApp;
    @Autowired private ListarRespuestasApp listarRespuestasApp;

    @GetMapping("/pregunta/{id}/detalles")
    public Map<String, Object> obtenerDetalles(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        PublicacionEntity pregunta = obtenerPublicacionApp.ejecutar(id);
        List<PublicacionEntity> respuestas = listarRespuestasApp.ejecutar(id);

        response.put("pregunta", pregunta);
        response.put("respuestas", respuestas);

        return response;
    }
}
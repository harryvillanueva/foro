package com.daw.foro.notificacion.infrastructure;

import com.daw.foro.notificacion.application.EnviarNotificacionApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/moderacion")
public class EnviarNotificacionController {

    @Autowired private EnviarNotificacionApp enviarNotificacionApp;

    @PostMapping("/avisar-usuario")
    public ResponseEntity<String> avisar(@RequestParam Long destinoId, @RequestBody String mensaje) {
        String emailMod = SecurityContextHolder.getContext().getAuthentication().getName();
        enviarNotificacionApp.ejecutar(emailMod, destinoId, mensaje);
        return ResponseEntity.ok("Aviso enviado correctamente");
    }
}
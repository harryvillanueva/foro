package com.daw.foro.moderacion.infrastructure;

import com.daw.foro.moderacion.application.ListarParticipantesSalaApp;
import com.daw.foro.moderacion.application.ModeracionAvanzadaApp;
import com.daw.foro.usuario.infrastructure.dto.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moderacion/avanzada")
public class ModeracionAvanzadaController {

    @Autowired private ModeracionAvanzadaApp app;
    @Autowired private ListarParticipantesSalaApp listarParticipantesApp;

    @PostMapping("/bloquear")
    public ResponseEntity<String> bloquear(@RequestParam Long usuarioId, @RequestParam Long salaId, @RequestParam int dias) {
        String emailMod = SecurityContextHolder.getContext().getAuthentication().getName();
        app.bloquearUsuario(emailMod, usuarioId, salaId, dias);
        return ResponseEntity.ok("El usuario ha sido bloqueado y notificado exitosamente.");
    }

    @PostMapping("/limite")
    public ResponseEntity<String> limite(@RequestParam Long salaId, @RequestParam int limite) {
        app.fijarLimite(salaId, limite);
        return ResponseEntity.ok("Límite de preguntas actualizado correctamente.");
    }

    @PostMapping("/solicitar-baja")
    public ResponseEntity<String> solicitarBaja(@RequestParam Long usuarioId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        app.solicitarBaja(email, usuarioId);
        return ResponseEntity.ok("Petición de baja enviada a la Superadministración.");
    }

    @GetMapping("/sala/{salaId}/participantes")
    public ResponseEntity<List<UsuarioResponseDTO>> listarParticipantes(@PathVariable Long salaId) {
        return ResponseEntity.ok(listarParticipantesApp.ejecutar(salaId));
    }
}
package com.daw.foro.usuario.infrastructure;

import com.daw.foro.usuario.application.GestionUsuarioAdminApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
public class GestionUsuarioAdminController {

    @Autowired private GestionUsuarioAdminApp app;

    @GetMapping
    public List<UsuarioEntity> listar() {
        return app.listarTodos();
    }

    @PostMapping("/{id}/toggle-activo")
    public ResponseEntity<String> toggle(@PathVariable Long id) {
        try {
            app.toggleEstado(id);
            return ResponseEntity.ok("Estado del usuario actualizado.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
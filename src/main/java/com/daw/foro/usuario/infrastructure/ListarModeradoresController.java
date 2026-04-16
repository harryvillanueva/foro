package com.daw.foro.usuario.infrastructure;

import com.daw.foro.usuario.application.ListarModeradoresApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/moderadores")
public class ListarModeradoresController {

    @Autowired
    private ListarModeradoresApp listarModeradoresApp;

    @GetMapping
    public List<UsuarioEntity> listar() {
        return listarModeradoresApp.ejecutar();
    }
}
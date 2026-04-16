package com.daw.foro.sala.infrastructure;

import com.daw.foro.sala.application.ListarSalasApp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/salas")
public class ListarSalasController {

    @Autowired
    private ListarSalasApp listarSalasApp;

    @GetMapping
    public List<SalaEntity> listar() {
        return listarSalasApp.ejecutar();
    }
}
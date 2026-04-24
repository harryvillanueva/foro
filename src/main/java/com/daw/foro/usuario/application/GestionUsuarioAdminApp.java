package com.daw.foro.usuario.application;

import com.daw.foro.usuario.infrastructure.UsuarioEntity;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import com.daw.foro.usuario.infrastructure.dto.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestionUsuarioAdminApp {

    @Autowired private UsuarioJpaRepository repository;

    public List<UsuarioEntity> listarTodos() {
        return repository.findAll();
    }

    public void toggleEstado(Long id) {
        UsuarioEntity user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // No permitimos que el Superadmin se autobanee por error
        if (user.getEmail().equals("admin@foro.com")) {
            throw new RuntimeException("No puedes desactivar la cuenta principal de administración.");
        }

        user.setActivo(!user.isActivo());
        repository.save(user);
    }
}
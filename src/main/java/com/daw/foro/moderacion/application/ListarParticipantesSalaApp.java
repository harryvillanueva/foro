package com.daw.foro.moderacion.application;

import com.daw.foro.sala.infrastructure.SuscripcionEntity;
import com.daw.foro.sala.infrastructure.SuscripcionJpaRepository;
import com.daw.foro.usuario.infrastructure.UsuarioJpaRepository;
import com.daw.foro.usuario.infrastructure.dto.UsuarioResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ListarParticipantesSalaApp {

    @Autowired private SuscripcionJpaRepository subRepo;
    @Autowired private UsuarioJpaRepository userRepo;

    public List<UsuarioResponseDTO> ejecutar(Long salaId) {
        List<SuscripcionEntity> subs = subRepo.findBySalaId(salaId);
        List<UsuarioResponseDTO> usuarios = new ArrayList<>();

        for (SuscripcionEntity sub : subs) {
            userRepo.findById(sub.getUsuarioId()).ifPresent(u -> {
                usuarios.add(new UsuarioResponseDTO(u.getId(), u.getNombre(), u.getEmail()));
            });
        }
        return usuarios;
    }
}
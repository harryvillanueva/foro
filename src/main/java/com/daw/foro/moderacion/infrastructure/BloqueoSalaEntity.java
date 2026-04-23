package com.daw.foro.moderacion.infrastructure;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bloqueos_sala")
public class BloqueoSalaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long usuarioId;

    @Column(nullable = false)
    private Long salaId;

    @Column(nullable = true)
    private LocalDateTime fechaFin; // Si es null, es un bloqueo permanente

    public BloqueoSalaEntity() {}

    public BloqueoSalaEntity(Long usuarioId, Long salaId, LocalDateTime fechaFin) {
        this.usuarioId = usuarioId;
        this.salaId = salaId;
        this.fechaFin = fechaFin;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }
}
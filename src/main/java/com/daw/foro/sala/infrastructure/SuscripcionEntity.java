package com.daw.foro.sala.infrastructure;

import jakarta.persistence.*;

@Entity
@Table(name = "suscripciones", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "sala_id"})
})
public class SuscripcionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "sala_id", nullable = false)
    private Long salaId;

    @Column(nullable = false)
    private boolean esFavorita = false;

    public SuscripcionEntity() {}

    public SuscripcionEntity(Long usuarioId, Long salaId) {
        this.usuarioId = usuarioId;
        this.salaId = salaId;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
    public boolean isEsFavorita() { return esFavorita; }
    public void setEsFavorita(boolean esFavorita) { this.esFavorita = esFavorita; }
}
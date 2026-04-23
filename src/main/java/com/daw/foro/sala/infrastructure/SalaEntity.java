package com.daw.foro.sala.infrastructure;

import jakarta.persistence.*;

@Entity
@Table(name = "salas")
public class SalaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private String tematica;
    private boolean requiereModeracion;

    @Column(name = "moderador_id", nullable = true)
    private Long moderadorId;

    @Column(nullable = false, columnDefinition = "int default 0")
    private int limitePreguntasSemana = 0; // 0 significa que no hay límite

    public SalaEntity() {}

    public SalaEntity(String nombre, String tematica, boolean requiereModeracion) {
        this.nombre = nombre;
        this.tematica = tematica;
        this.requiereModeracion = requiereModeracion;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTematica() { return tematica; }
    public void setTematica(String tematica) { this.tematica = tematica; }
    public boolean isRequiereModeracion() { return requiereModeracion; }
    public void setRequiereModeracion(boolean requiereModeracion) { this.requiereModeracion = requiereModeracion; }
    public Long getModeradorId() { return moderadorId; }
    public void setModeradorId(Long moderadorId) { this.moderadorId = moderadorId; }
    public int getLimitePreguntasSemana() { return limitePreguntasSemana; }
    public void setLimitePreguntasSemana(int limitePreguntasSemana) { this.limitePreguntasSemana = limitePreguntasSemana; }
}
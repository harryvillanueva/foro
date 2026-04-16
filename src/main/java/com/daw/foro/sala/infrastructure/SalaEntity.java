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

    @Column(nullable = false)
    private String tematica;

    @Column(nullable = false)
    private boolean requiereModeracion;

    public SalaEntity() {}

    public SalaEntity(String nombre, String tematica, boolean requiereModeracion) {
        this.nombre = nombre;
        this.tematica = tematica;
        this.requiereModeracion = requiereModeracion;
    }

    // Getters y Setters... (hazlos tú mismo sin Lombok 😉)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTematica() { return tematica; }
    public void setTematica(String tematica) { this.tematica = tematica; }
    public boolean isRequiereModeracion() { return requiereModeracion; }
    public void setRequiereModeracion(boolean requiereModeracion) { this.requiereModeracion = requiereModeracion; }
}
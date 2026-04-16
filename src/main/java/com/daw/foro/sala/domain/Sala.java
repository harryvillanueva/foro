package com.daw.foro.sala.domain;

public class Sala {
    private Long id;
    private String nombre;
    private String tematica;
    private boolean requiereModeracion;

    public Sala() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTematica() { return tematica; }
    public void setTematica(String tematica) { this.tematica = tematica; }
    public boolean isRequiereModeracion() { return requiereModeracion; }
    public void setRequiereModeracion(boolean requiereModeracion) { this.requiereModeracion = requiereModeracion; }
}
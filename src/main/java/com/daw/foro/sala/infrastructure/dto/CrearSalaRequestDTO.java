package com.daw.foro.sala.infrastructure.dto;

public class CrearSalaRequestDTO {
    private String nombre;
    private String tematica;
    private boolean requiereModeracion;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTematica() { return tematica; }
    public void setTematica(String tematica) { this.tematica = tematica; }
    public boolean isRequiereModeracion() { return requiereModeracion; }
    public void setRequiereModeracion(boolean requiereModeracion) { this.requiereModeracion = requiereModeracion; }
}
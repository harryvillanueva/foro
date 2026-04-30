package com.daw.foro.publicacion.infrastructure.dto;

import java.time.LocalDateTime;

public class PreguntaResponseDTO {
    private Long id;
    private String contenido;
    private String autorNombre;
    private LocalDateTime fechaCreacion;
    private long cantidadRespuestas;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }

    public String getAutorNombre() { return autorNombre; }
    public void setAutorNombre(String autorNombre) { this.autorNombre = autorNombre; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public long getCantidadRespuestas() { return cantidadRespuestas; }
    public void setCantidadRespuestas(long cantidadRespuestas) { this.cantidadRespuestas = cantidadRespuestas; }
}
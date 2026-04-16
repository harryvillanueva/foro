package com.daw.foro.publicacion.infrastructure.dto;

public class PublicarRequestDTO {
    private Long salaId;
    private String contenido;
    private Long preguntaPadreId; // Puede venir nulo si es una nueva pregunta

    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public Long getPreguntaPadreId() { return preguntaPadreId; }
    public void setPreguntaPadreId(Long preguntaPadreId) { this.preguntaPadreId = preguntaPadreId; }
}
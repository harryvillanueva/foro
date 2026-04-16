package com.daw.foro.sala.infrastructure.dto;

public class AsignarModeradorRequestDTO {
    private Long salaId;
    private Long moderadorId;

    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
    public Long getModeradorId() { return moderadorId; }
    public void setModeradorId(Long moderadorId) { this.moderadorId = moderadorId; }
}
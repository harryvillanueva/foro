package com.daw.foro.notificacion.infrastructure;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
public class NotificacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long usuarioDestinoId;
    private Long autorId; // El moderador que envía
    private String autorNombre;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    private LocalDateTime fecha = LocalDateTime.now();
    private boolean leida = false;

    public NotificacionEntity() {}

    public NotificacionEntity(Long usuarioDestinoId, Long autorId, String autorNombre, String mensaje) {
        this.usuarioDestinoId = usuarioDestinoId;
        this.autorId = autorId;
        this.autorNombre = autorNombre;
        this.mensaje = mensaje;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUsuarioDestinoId() { return usuarioDestinoId; }
    public void setUsuarioDestinoId(Long usuarioDestinoId) { this.usuarioDestinoId = usuarioDestinoId; }
    public Long getAutorId() { return autorId; }
    public void setAutorId(Long autorId) { this.autorId = autorId; }
    public String getAutorNombre() { return autorNombre; }
    public void setAutorNombre(String autorNombre) { this.autorNombre = autorNombre; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public boolean isLeida() { return leida; }
    public void setLeida(boolean leida) { this.leida = leida; }
}
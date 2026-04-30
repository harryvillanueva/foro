package com.daw.foro.publicacion.infrastructure;

import com.daw.foro.publicacion.domain.EstadoPublicacion;
import com.daw.foro.publicacion.domain.TipoPublicacion;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "publicaciones")
public class PublicacionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contenido;

    private Long autorId;
    private String autorNombre;
    private Long salaId;

    @Column(nullable = true)
    private Long preguntaPadreId;

    @Enumerated(EnumType.STRING)
    private TipoPublicacion tipo;

    @Enumerated(EnumType.STRING)
    private EstadoPublicacion estado;

    private LocalDateTime fechaCreacion = LocalDateTime.now();

    public PublicacionEntity() {}

    public PublicacionEntity(String contenido, Long autorId, String autorNombre, Long salaId, Long preguntaPadreId, TipoPublicacion tipo, EstadoPublicacion estado) {
        this.contenido = contenido; this.autorId = autorId; this.autorNombre = autorNombre;
        this.salaId = salaId; this.preguntaPadreId = preguntaPadreId; this.tipo = tipo; this.estado = estado;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContenido() { return contenido; }
    public void setContenido(String contenido) { this.contenido = contenido; }
    public Long getAutorId() { return autorId; }
    public void setAutorId(Long autorId) { this.autorId = autorId; }
    public String getAutorNombre() { return autorNombre; }
    public void setAutorNombre(String autorNombre) { this.autorNombre = autorNombre; }
    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
    public Long getPreguntaPadreId() { return preguntaPadreId; }
    public void setPreguntaPadreId(Long preguntaPadreId) { this.preguntaPadreId = preguntaPadreId; }
    public TipoPublicacion getTipo() { return tipo; }
    public void setTipo(TipoPublicacion tipo) { this.tipo = tipo; }
    public EstadoPublicacion getEstado() { return estado; }
    public void setEstado(EstadoPublicacion estado) { this.estado = estado; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
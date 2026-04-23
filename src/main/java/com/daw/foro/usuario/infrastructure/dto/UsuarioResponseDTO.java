package com.daw.foro.usuario.infrastructure.dto;

public class UsuarioResponseDTO {
    private Long id;
    private String nombre;
    private String email;

    public UsuarioResponseDTO() {}

    public UsuarioResponseDTO(Long id, String nombre, String email) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
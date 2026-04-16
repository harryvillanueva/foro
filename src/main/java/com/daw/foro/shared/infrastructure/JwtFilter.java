package com.daw.foro.shared.infrastructure;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    // Extraemos la clave secreta directamente de JwtService (asegúrate de que SECRET_KEY sea public static o expón un método en JwtService para obtenerla. Por simplicidad, copiaremos la lógica aquí, aunque lo ideal es que JwtService valide el token).
    // Para mantenerlo limpio, vamos a inyectar JwtService

    private final JwtService jwtService;

    public JwtFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // 1. Obtener la cabecera "Authorization"
        String authHeader = request.getHeader("Authorization");

        // 2. Comprobar si existe y empieza por "Bearer "
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Quitamos "Bearer "

            try {
                // 3. Validar el token y extraer los datos
                Claims claims = jwtService.extraerClaims(token);
                String email = claims.getSubject();
                String rol = claims.get("rol", String.class);

                // 4. Decirle a Spring Security quién es este usuario y qué rol tiene
                // IMPORTANTE: Spring Security espera que los roles empiecen con "ROLE_"
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + rol);

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        email, null, Collections.singletonList(authority)
                );

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            } catch (Exception e) {
                // Si el token expiró o está alterado, limpiamos el contexto
                SecurityContextHolder.clearContext();
            }
        }

        // 5. Continuar con la cadena de filtros (dejar pasar la petición)
        filterChain.doFilter(request, response);
    }
}
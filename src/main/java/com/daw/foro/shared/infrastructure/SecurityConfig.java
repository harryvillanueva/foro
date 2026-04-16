package com.daw.foro.shared.infrastructure;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. Permitir la API de autenticación
                        .requestMatchers("/api/auth/**").permitAll()

                        // 2. Permitir el acceso a los archivos HTML públicos
                        .requestMatchers("/", "/index.html", "/registro.html", "/login.html").permitAll()

                        // 3. Permitir el acceso a las carpetas de recursos estáticos (Vanilla JS, CSS, imágenes)
                        .requestMatchers("/js/**", "/css/**", "/img/**").permitAll()

                        // 4. Todo lo demás (otras APIs) requerirá token más adelante
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
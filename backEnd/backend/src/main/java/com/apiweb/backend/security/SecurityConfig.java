package com.apiweb.backend.security;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.apiweb.backend.security.jwt.JwtAuthFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()  // ya estabas deshabilitando CSRF
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // tus endpoints públicos
                .requestMatchers("/space/usuarios/registrar").permitAll()
                .requestMatchers("/space/usuarios/iniciarSesion").permitAll()
                .requestMatchers("/space/usuarios/verificar").permitAll()
                .requestMatchers("/space/usuarios/recuperacion").permitAll()
                .requestMatchers("/space/usuarios/restablecer").permitAll()
                .requestMatchers("/space/usuarios/login-google").permitAll()
                .requestMatchers("/space/usuarios/refresh-token").permitAll()
                .requestMatchers("/test.html").permitAll()

                // ADD: permitir SockJS/STOMP
                .requestMatchers("/ws-chat/**").permitAll()
                .requestMatchers("/app/**").permitAll()
                .requestMatchers("/topic/**").permitAll()

                // resto: requieren JWT
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Si sigues sirviendo tu front en 5173 o pruebas desde otros orígenes:
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://127.0.0.1:5500"  // si aún lo usas
        ));
        config.setAllowedMethods(Arrays.asList("GET","POST", "PATCH", "PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // aplica a todas tus rutas, incluidas /ws-chat/** y /test.html
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

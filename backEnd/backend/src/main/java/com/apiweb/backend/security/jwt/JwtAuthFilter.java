package com.apiweb.backend.security.jwt;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// En Spring Boot 3.x => import jakarta.servlet.FilterChain; ...
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
                                    throws ServletException, IOException {

        // 1) Obtener el encabezado Authorization
        String authHeader = request.getHeader("Authorization");

        // 2) Validar que sea "Bearer <token>"
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return; 
        }

        // 3) Extraer token
        String token = authHeader.substring(7);

        // 4) Validar token
        if (jwtUtils.validateToken(token)) {
            // 5) Extraer username del token
            String username = jwtUtils.getUsernameFromToken(token);

            // 6) Crear objeto de autenticación
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            username, // principal
                            null,     // credentials (no hay password en este punto)
                            null      // authorities (si quisieras roles)
                    );

            // 7) Asignar details y contexto de seguridad
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // 8) Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}

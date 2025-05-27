package com.apiweb.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcCorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/ws-chat/**")
            .allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500")
            .allowedMethods("GET", "POST", "PATCH", "OPTIONS")
            .allowCredentials(true);
    }
}

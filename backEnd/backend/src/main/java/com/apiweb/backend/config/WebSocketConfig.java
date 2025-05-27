package com.apiweb.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // Registrar el endpoint que usarán los clientes para conectarse al WebSocket
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
            .setAllowedOriginPatterns("*")   // <- lo más sencillo en dev
            .withSockJS();
    }


    // Configurar el broker para manejar destinos de mensajes
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");  // Prefijo para mensajes que el servidor enviará a clientes
        config.setApplicationDestinationPrefixes("/app"); // Prefijo para mensajes enviados por clientes al servidor
    }
}


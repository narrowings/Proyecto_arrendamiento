package com.apiweb.backend.dto;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private Integer idConversacion;
    private Integer idUsuario;
    private String contenido;
}
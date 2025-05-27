package com.apiweb.backend.Controller;

import com.apiweb.backend.dto.ChatMessageDTO;
import com.apiweb.backend.Model.conversacionModel;
import com.apiweb.backend.Model.mensajeModel;
import com.apiweb.backend.Model.usuariosModel;
import com.apiweb.backend.Repository.IConversacionRepository;
import com.apiweb.backend.Repository.IMensajeRepository;
import com.apiweb.backend.Repository.IUsuariosRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private IMensajeRepository mensajeRepository;

    @Autowired
    private IConversacionRepository conversacionRepository;

    @Autowired
    private IUsuariosRepository usuariosRepository;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageDTO chatMessageDTO) {
        conversacionModel conversacion = conversacionRepository.findById(chatMessageDTO.getIdConversacion()).orElse(null);
        if (conversacion == null) {
            // Opcional: crear conversación o manejar error
            return;
        }

        usuariosModel usuario = usuariosRepository.findById(chatMessageDTO.getIdUsuario()).orElse(null);
        if (usuario == null) return;

        mensajeModel mensaje = new mensajeModel();
        mensaje.setConversacion(conversacion);
        mensaje.setUsuario(usuario);
        mensaje.setContenido(chatMessageDTO.getContenido());
        mensaje.setVisto(false);
        mensaje.setCreado(LocalDateTime.now());
        mensajeRepository.save(mensaje);

        messagingTemplate.convertAndSend("/topic/conversacion/" + chatMessageDTO.getIdConversacion(), mensaje);
    }
}

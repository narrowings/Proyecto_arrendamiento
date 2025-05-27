package com.apiweb.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmail(String to, String subject, String text) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(text);
        mailSender.send(mailMessage);
    }

    public void enviarCorreoVerificacion(String to, String token) {
        String subject = "Verificación de Cuenta";
        String frontendUrl = "http://localhost:5173/verificar?token=" + token; // Cambiar al frontend
        String text = "¡Gracias por registrarte! Para completar tu registro, haz clic en el siguiente enlace:\n\n"
            + frontendUrl
            + "\n\nEste enlace expira en 24 horas.";
        enviarEmail(to, subject, text);
    }

    /** Ahora apuntamos al endpoint backend `/restablecer` */
    public void enviarCorreoRecuperacion(String to, String token) {
        String subject = "Recuperación de Contraseña";
        String backendUrl = "http://localhost:5173/space/usuarios/restablecer?token=" + token;
        String text = "Hola,\n\n"
                + "Para restablecer tu contraseña, haz clic en el siguiente enlace:\n\n"
                + backendUrl
                + "\n\nEste enlace será válido por 24 horas.\n\n"
                + "Si no solicitaste este cambio, ignora este mensaje.";
        enviarEmail(to, subject, text);
    }
}

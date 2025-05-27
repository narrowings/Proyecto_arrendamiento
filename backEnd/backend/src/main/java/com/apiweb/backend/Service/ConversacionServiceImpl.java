package com.apiweb.backend.Service;

import com.apiweb.backend.Model.conversacionModel;
import com.apiweb.backend.Model.mensajeModel;
import com.apiweb.backend.Repository.IConversacionRepository;
import com.apiweb.backend.Repository.IMensajeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConversacionServiceImpl implements IConversacionService {

    @Autowired
    private IConversacionRepository conversacionRepository;

    @Autowired
    private IMensajeRepository mensajeRepository;

    @Override
    public conversacionModel crearOObtenerConversacion(conversacionModel conversacion) {
        List<conversacionModel> existentes = conversacionRepository.findAll().stream()
            .filter(c -> c.getAviso().getIdAvisos().equals(conversacion.getAviso().getIdAvisos()) &&
                         c.getUsuarioInteresado().getIdUsuarios().equals(conversacion.getUsuarioInteresado().getIdUsuarios()))
            .toList();

        if (!existentes.isEmpty()) {
            return existentes.get(0);
        }

        conversacion.setEstado("activa");
        conversacion.setCreado(LocalDateTime.now());
        return conversacionRepository.save(conversacion);
    }

    @Override
    public List<conversacionModel> obtenerConversacionesPorUsuario(Integer idUsuario) {
        return conversacionRepository.findAll().stream()
                .filter(c -> c.getUsuarioInteresado().getIdUsuarios().equals(idUsuario))
                .toList();
    }

    @Override
    public Optional<conversacionModel> obtenerConversacionPorId(Integer id) {
        Optional<conversacionModel> conversacion = conversacionRepository.findById(id);
        conversacion.ifPresent(conv -> {
            List<mensajeModel> mensajes = mensajeRepository.findByConversacionIdConversacionOrderByCreadoAsc(id);
            conv.setMensajes(mensajes);
        });
        return conversacion;
    }

    @Override
    public void eliminarConversacion(Integer id) {
        if (conversacionRepository.existsById(id)) {
            conversacionRepository.deleteById(id);
        }
    }

    @Override
    public conversacionModel actualizarEstado(Integer id, String estado) {
        Optional<conversacionModel> conversacion = conversacionRepository.findById(id);
        if (conversacion.isPresent()) {
            conversacionModel conv = conversacion.get();
            conv.setEstado(estado);
            return conversacionRepository.save(conv);
        }
        return null;
    }

    @Override
    public List<conversacionModel> obtenerConversacionesPorDueñoDeAviso(Integer idUsuario) {
        return conversacionRepository.findAll().stream()
            .filter(c ->
                c.getAviso()
                .getIdEspacios()        // espaciosModel
                .getUsuario()           // usuariosModel propietario
                .getIdUsuarios()        // su id
                .equals(idUsuario)
            )
            .toList();
    }

}

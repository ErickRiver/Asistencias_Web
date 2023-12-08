/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.controller.ControllerDiaClase;
import org.utl.controller.ControllerHorario;
import org.utl.model.DiaClase;
import org.utl.model.Horario;

/**
 *
 * @author DaniV
 */
@Path("horario")
public class RESTHorario {

    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosHorario") @DefaultValue("") String datosHorario) {
        String out = null;
        Gson gson = new Gson();
        Horario horario = null;
        ControllerHorario ch = new ControllerHorario();
        try {
            horario = gson.fromJson(datosHorario, Horario.class);
            ch.insert(horario);
            out = gson.toJson(horario);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getAllFiltro")
    @Produces(MediaType.APPLICATION_JSON)
        public Response getAll(@FormParam("datosHorario") @DefaultValue("") String datosHorario) {
        String out = null;
        Gson gson = new Gson();
        Horario horario = null;
        ControllerHorario ch = new ControllerHorario();
        try {
            horario = gson.fromJson(datosHorario, Horario.class);
            List<Horario> listaHorario = ch.getAllFiltro(horario.getDiaClase().getIdDiaClase());
            out = gson.toJson(listaHorario);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        String out = null;
        Gson gson = new Gson();
        ControllerHorario ch = new ControllerHorario();
        try {
            List<Horario> listaHorario = ch.getAll();
            out = gson.toJson(listaHorario);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}

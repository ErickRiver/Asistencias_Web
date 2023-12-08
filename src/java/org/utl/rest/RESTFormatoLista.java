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
import java.util.ArrayList;
import java.util.List;
import org.utl.controller.ControllerFormatoLista;
import org.utl.model.DiaClase;
import org.utl.model.DiaInhabil;
import org.utl.model.FormatoLista;
import org.utl.model.Horario;

/**
 *
 * @author DaniV
 */
@Path("formatoLista")
public class RESTFormatoLista {

    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosFormato") @DefaultValue("") String datosFormato) {
        String out = null;
        Gson gson = new Gson();
        FormatoLista formatoLista = null;
        ControllerFormatoLista cla = new ControllerFormatoLista();
        try {
            formatoLista = gson.fromJson(datosFormato, FormatoLista.class);
            cla.insert(formatoLista);
            out = gson.toJson(formatoLista);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        //cgla.insert(formatoLista, diaInhabilList, diaClaseList, horarioList);
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getAllFiltro")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFiltro(@FormParam("datosFormato") @DefaultValue("") String datosFormato) {
        String out = null;
        Gson gson = new Gson();
        FormatoLista formatoLista = null;
        ControllerFormatoLista cla = new ControllerFormatoLista();
        try {
            formatoLista = gson.fromJson(datosFormato, FormatoLista.class);
            List<FormatoLista> listaFormatos = cla.getAllFiltro(formatoLista.getDocente().getIdDocente(),
                    formatoLista.getGrupo().getIdGrupo(), formatoLista.getMateria().getIdMateria());
            out = gson.toJson(listaFormatos);
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
        ControllerFormatoLista cla = new ControllerFormatoLista();
        
        try {
            List<FormatoLista> listaFormatos = cla.getAll();
            out = gson.toJson(listaFormatos);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
    
}

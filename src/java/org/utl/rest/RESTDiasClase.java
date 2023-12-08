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
import org.utl.controller.ControllerListaAsistencia;
import org.utl.model.DiaClase;
import org.utl.model.ListaAsistencia;

/**
 *
 * @author DaniV
 */
@Path("diasClase")
public class RESTDiasClase {

    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosDiaClase") @DefaultValue("") String datosDiasClase) {
        String out = null;
        Gson gson = new Gson();
        DiaClase diaClase = null;
        ControllerDiaClase cdc = new ControllerDiaClase();
        try {
            diaClase = gson.fromJson(datosDiasClase, DiaClase.class);
            cdc.insert(diaClase);
            out = gson.toJson(diaClase);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getDiasPorFormatoLista")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDiasPorFormatoLista(@FormParam("datosDiasClase") @DefaultValue("") String datosDiasClase) {
        String out = null;
        Gson gson = new Gson();
        DiaClase diaClase = null;
        ControllerDiaClase cdc = new ControllerDiaClase();
        try {
            diaClase = gson.fromJson(datosDiasClase, DiaClase.class);
            List<DiaClase> listaDias = cdc.getDiaPorFormatoLista(diaClase.getFormatoLista().getIdFormatoLista());
            out = gson.toJson(listaDias);
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
        DiaClase diaClase = null;
        ControllerDiaClase cdc = new ControllerDiaClase();
        try {
            List<DiaClase> listaDias = cdc.getAll();
            out = gson.toJson(listaDias);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

}

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
import org.utl.controller.ControllerDiaInhabil;
import org.utl.model.DiaClase;
import org.utl.model.DiaInhabil;

/**
 *
 * @author DaniV
 */
@Path("diaInhabil")
public class RESTDiasInhabiles {

    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosDiaInhabiles") @DefaultValue("") String datosDiaInhabiles) {
        String out = null;
        Gson gson = new Gson();
        DiaInhabil diaInhabil = null;
        ControllerDiaInhabil cdi = new ControllerDiaInhabil();
        try {
            diaInhabil = gson.fromJson(datosDiaInhabiles, DiaInhabil.class);
            cdi.insert(diaInhabil);
            out = gson.toJson(diaInhabil);
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
        ControllerDiaInhabil cdc = new ControllerDiaInhabil();
        try {
            List<DiaInhabil> listaDias = cdc.getAll();
            out = gson.toJson(listaDias);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getDiasPorFormatoLista")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@FormParam("datosDiaInhabiles") @DefaultValue("") String datosDiaInhabiles) {
        String out = null;
        Gson gson = new Gson();
        DiaInhabil diaInhabil = null;
        ControllerDiaInhabil cdi = new ControllerDiaInhabil();
        try {
            diaInhabil = gson.fromJson(datosDiaInhabiles, DiaInhabil.class);
            List<DiaInhabil> listaDias = cdi.getDiasPorFormatoLista(diaInhabil.getFormatoLista().getIdFormatoLista());
            out = gson.toJson(listaDias);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}

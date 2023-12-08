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
import org.utl.controller.ControllerFormatoLista;
import org.utl.controller.ControllerListaAsistencia;
import org.utl.model.FormatoLista;
import org.utl.model.ListaAsistencia;

/**
 *
 * @author DaniV
 */
@Path("listaAsistencia")
public class RESTListaAsistencia {

    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosLista") @DefaultValue("") String datosLista) {
        String out = null;
        Gson gson = new Gson();
        ListaAsistencia listaAsistencia = null;
        ControllerListaAsistencia cla = new ControllerListaAsistencia();
        try {
            listaAsistencia = gson.fromJson(datosLista, ListaAsistencia.class);
            cla.insert(listaAsistencia);
            out = gson.toJson(listaAsistencia);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@FormParam("datosLista") @DefaultValue("") String datosLista) {
        String out = null;
        Gson gson = new Gson();
        ControllerListaAsistencia cla = new ControllerListaAsistencia();
        try {
            List<ListaAsistencia> listaFormatos = cla.getAll();
            out = gson.toJson(listaFormatos);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getAllFiltro")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllFiltro(@FormParam("datosLista") @DefaultValue("") String datosLista) {
        String out = null;
        Gson gson = new Gson();
        ListaAsistencia listaAsistencia = null;
        ControllerListaAsistencia cla = new ControllerListaAsistencia();
        try {
            listaAsistencia = gson.fromJson(datosLista, ListaAsistencia.class);
            List<ListaAsistencia> listaFormatos = cla.getAllFiltro(listaAsistencia.getAlumno().getIdAlumno(),
                    listaAsistencia.getMateria().getIdMateria(), listaAsistencia.getDocente().getIdDocente());
            out = gson.toJson(listaFormatos);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}

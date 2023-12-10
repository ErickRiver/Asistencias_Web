/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package org.utl.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.controller.ControllerDiaClase;
import org.utl.controller.ControllerGrupo;
import org.utl.controller.ControllerHorario;
import org.utl.model.DiaClase;
import org.utl.model.Grupo;
import org.utl.model.Horario;

@Path("grupo")
public class RESTGrupo {

    @POST
    @Path("save")
    @Produces(MediaType.APPLICATION_JSON)
    public Response save(@FormParam("datosGrupo") @DefaultValue("") String datosGrupo) {
        String out = null;
        Gson gson = new Gson();
        Grupo grupo = null;
        ControllerGrupo ctrGrupo = new ControllerGrupo();
        try {
            grupo = gson.fromJson(datosGrupo, Grupo.class);
            int idGrupo = ctrGrupo.insertAndGetID(grupo);
            out = gson.toJson(idGrupo);
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
        Grupo grupo = null;
        ControllerGrupo cg = new ControllerGrupo();
        try {
            List<Grupo> listaHorario = cg.getAll();
            out = gson.toJson(listaHorario);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}

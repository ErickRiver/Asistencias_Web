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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.controller.ControllerDirectivo;
import org.utl.controller.ControllerDocente;
import org.utl.model.Directivo;
import org.utl.model.Usuario;

/**
 *
 * @author DaniV
 */
@Path("directivo")
public class RESTDirectivo {
    
    @POST
    @Path("getDirectivo")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDirectivo(@FormParam("idUsuario") @DefaultValue("0") int idUsuario){
        String out = null;
        Gson gson = new Gson();
        
        ControllerDirectivo  cd = new ControllerDirectivo();
        try{
            Directivo directivo = cd.getDirectivo(idUsuario);
            out = gson.toJson(directivo);
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
        ControllerDirectivo cd = new ControllerDirectivo();
        
        try {
            List<Directivo> listaDirectivos = cd.getAll();
            out = gson.toJson(listaDirectivos);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
    
}

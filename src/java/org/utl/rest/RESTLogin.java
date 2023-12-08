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
import org.utl.controller.ControllerLogin;
import org.utl.model.Alumno;
import org.utl.model.Directivo;
import org.utl.model.Docente;
import org.utl.model.Grupo;
import org.utl.model.Usuario;

/**
 *
 * @author DaniV
 */
@Path("log")
public class RESTLogin {

    @POST
    @Path("in")
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@FormParam("datosUsuario") @DefaultValue("") String datosUsuario) throws Exception {
        String out = null;
        Gson gson = new Gson();
        Usuario usu = null;
        ControllerLogin cl = new ControllerLogin();
        try {
            usu = gson.fromJson(datosUsuario, Usuario.class);
            Usuario usuario = cl.login(usu);
            out = gson.toJson(usuario);
        }catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

}

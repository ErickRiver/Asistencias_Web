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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.controller.ControllerAlumno;
import org.utl.model.Alumno;
import org.utl.model.DiaClase;
import org.utl.model.Grupo;
import org.utl.model.Usuario;

/**
 *
 * @author DaniV
 */
@Path("Alumno")
public class RESTAlumno {

    @POST
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        String out = null;
        Gson gson = new Gson();
        Grupo alumno = null;
        ControllerAlumno ctrAlumno = new ControllerAlumno();
        try {
            List<Alumno> listaAlumnos = ctrAlumno.getAll();
            out = gson.toJson(listaAlumnos);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @POST
    @Path("getAlumnoOGrupo")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@FormParam("idGrupo") @DefaultValue("0") int idGrupo,
                           @FormParam("idUsuario") @DefaultValue("0") int idUsuario) {
        String out = null;
        Gson gson = new Gson();
        ControllerAlumno ctrAlumno = new ControllerAlumno();
        
        try {
            List<Alumno> listaAlumnos = ctrAlumno.getAlumnoOgrupo(idGrupo, idUsuario);
            System.out.println("HOLAAAAAAAAAA");
            System.out.println(listaAlumnos);
            out = gson.toJson(listaAlumnos);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
    
    @POST
    @Path("getAlumnosGrupo")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@FormParam("idGrupo") @DefaultValue("0") int idGrupo) {
        String out = null;
        Gson gson = new Gson();
        Grupo alumno = null;
        ControllerAlumno ctrAlumno = new ControllerAlumno();
        try {
            List<Alumno> listaAlumnos = ctrAlumno.getAlumnosGrupo(idGrupo);
            out = gson.toJson(listaAlumnos);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }

}

package org.utl.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.utl.controller.ControllerGrupo;
import org.utl.controller.ControllerMateria;
import org.utl.model.Grupo;
import org.utl.model.Materia;

@Path("materia")
public class RESTMateria {

    @POST
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        String out = null;
        Gson gson = new Gson();
        ControllerMateria cm = new ControllerMateria();
        try {
            List<Materia> listaMaterias = cm.getAll();
            out = gson.toJson(listaMaterias);
        } catch (Exception e) {
            e.printStackTrace();
            out = "{\"exception\":\"Error interno del servidor.\"}";
        }

        return Response.status(Response.Status.OK).entity(out).build();
    }
}

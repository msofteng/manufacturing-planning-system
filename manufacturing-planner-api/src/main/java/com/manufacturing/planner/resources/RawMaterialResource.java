package com.manufacturing.planner.resources;

import java.util.List;

import com.manufacturing.planner.entities.RawMaterialEntity;
import com.manufacturing.planner.repos.RawMaterialRepository;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;

@Path("/material")
public class RawMaterialResource {
  @Inject
  private RawMaterialRepository rawMaterialRepository;
  
  @GET
  @Path("/{id}")
  public RawMaterialEntity getRawMaterial(@PathParam("id") Long id) {
    return rawMaterialRepository.findById(id);
  }

  @GET
  @Path("/list")
  public List<RawMaterialEntity> listRawMaterials() {
    return rawMaterialRepository.findAll().list();
  }
}
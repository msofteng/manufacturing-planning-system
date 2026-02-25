package com.manufacturing.planner.resources;

import java.util.List;

import com.manufacturing.planner.entities.ProductEntity;
import com.manufacturing.planner.repos.ProductRepository;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;

@Path("/product")
public class ProductResource {
  @Inject
  private ProductRepository productRepository;

  @GET
  @Path("/{id}")
  public ProductEntity getProduct(@PathParam("id") Long id) {
    return productRepository.findById(id);
  }

  @GET
  @Path("/list")
  public List<ProductEntity> listProducts() {
    return productRepository.findAll().list();
  }
}
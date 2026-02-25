package com.manufacturing.planner.repos;

import com.manufacturing.planner.entities.ProductEntity;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProductRepository implements PanacheRepository<ProductEntity> {}
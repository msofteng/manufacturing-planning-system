package com.manufacturing.planner.repos;

import com.manufacturing.planner.entities.BillOfMaterialEntity;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class BillOfMaterialRepository implements PanacheRepository<BillOfMaterialEntity> {}
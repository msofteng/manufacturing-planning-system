package com.manufacturing.planner.repos;

import com.manufacturing.planner.entities.RawMaterialEntity;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RawMaterialRepository implements PanacheRepository<RawMaterialEntity> {}
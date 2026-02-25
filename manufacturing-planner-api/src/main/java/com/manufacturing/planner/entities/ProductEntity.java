package com.manufacturing.planner.entities;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity(name = "product")
public class ProductEntity {
  @Id
  @GeneratedValue
  private Long id;
  private String code;
  private String name;
  private Double price;

  @OneToMany(mappedBy = "product", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
  private List<BillOfMaterialEntity> billOfMaterials;
}
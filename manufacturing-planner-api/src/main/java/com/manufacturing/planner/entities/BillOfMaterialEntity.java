package com.manufacturing.planner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity(name = "bill_of_material")
public class BillOfMaterialEntity {
  @Id
  @GeneratedValue
  private Long id;

  @ManyToOne
  @JoinColumn(name = "product_id")
  @JsonIgnore // Quebra a referência circular com ProductEntity
  private ProductEntity product;

  @ManyToOne
  @JoinColumn(name = "raw_material_id")
  private RawMaterialEntity rawMaterial;

  @Column(name = "quantity")
  private Integer quantityNeeded;
}
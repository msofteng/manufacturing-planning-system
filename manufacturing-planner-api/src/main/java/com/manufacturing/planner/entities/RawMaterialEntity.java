package com.manufacturing.planner.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity(name = "raw_material")
public class RawMaterialEntity {
  @Id
  @GeneratedValue
  private Long id;

  private String code;
  private String name;

  @Column(name = "quantity")
  private Integer stockQuantity;

  @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL)
  @JsonIgnore // Evita loop infinito rawMaterial -> billOfMaterials -> rawMaterial
  private List<BillOfMaterialEntity> billOfMaterials;
}
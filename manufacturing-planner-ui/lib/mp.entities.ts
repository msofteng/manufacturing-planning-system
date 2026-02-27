export interface RawMaterial {
  id: number
  code: string
  name: string
  stockQuantity: number
}

export interface BillOfMaterialItem {
  id: number
  rawMaterial: RawMaterial
  quantityNeeded: number
}

export interface Product {
  id: number
  code: string
  name: string
  price: number
  billOfMaterials: BillOfMaterialItem[]
}
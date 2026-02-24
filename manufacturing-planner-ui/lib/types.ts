export interface RawMaterial {
  id: string
  code: string
  name: string
  stockQuantity: number
}

export interface BillOfMaterialItem {
  rawMaterialId: string
  quantityNeeded: number
}

export interface Product {
  id: string
  code: string
  name: string
  price: number
  billOfMaterials: BillOfMaterialItem[]
}

export interface ProductionPlanItem {
  productId: string
  productName: string
  productCode: string
  maxQuantity: number
  unitPrice: number
  totalValue: number
}

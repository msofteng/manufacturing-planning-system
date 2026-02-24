import { Product, RawMaterial } from "./types"

const PRODUCTS_KEY = "mps_products"
const RAW_MATERIALS_KEY = "mps_raw_materials"

// Seed data
const defaultRawMaterials: RawMaterial[] = [
  { id: "rm-1", code: "RM-001", name: "Steel Sheet", stockQuantity: 500 },
  { id: "rm-2", code: "RM-002", name: "Aluminum Bar", stockQuantity: 300 },
  { id: "rm-3", code: "RM-003", name: "Copper Wire", stockQuantity: 1000 },
  { id: "rm-4", code: "RM-004", name: "Plastic Resin", stockQuantity: 800 },
  { id: "rm-5", code: "RM-005", name: "Rubber Gasket", stockQuantity: 200 },
]

const defaultProducts: Product[] = [
  {
    id: "prod-1",
    code: "PRD-001",
    name: "Industrial Motor",
    price: 450.0,
    billOfMaterials: [
      { rawMaterialId: "rm-1", quantityNeeded: 5 },
      { rawMaterialId: "rm-3", quantityNeeded: 10 },
      { rawMaterialId: "rm-5", quantityNeeded: 2 },
    ],
  },
  {
    id: "prod-2",
    code: "PRD-002",
    name: "Control Panel",
    price: 320.0,
    billOfMaterials: [
      { rawMaterialId: "rm-1", quantityNeeded: 2 },
      { rawMaterialId: "rm-3", quantityNeeded: 15 },
      { rawMaterialId: "rm-4", quantityNeeded: 3 },
    ],
  },
  {
    id: "prod-3",
    code: "PRD-003",
    name: "Hydraulic Pump",
    price: 780.0,
    billOfMaterials: [
      { rawMaterialId: "rm-1", quantityNeeded: 8 },
      { rawMaterialId: "rm-2", quantityNeeded: 4 },
      { rawMaterialId: "rm-5", quantityNeeded: 6 },
    ],
  },
  {
    id: "prod-4",
    code: "PRD-004",
    name: "Sensor Module",
    price: 150.0,
    billOfMaterials: [
      { rawMaterialId: "rm-3", quantityNeeded: 5 },
      { rawMaterialId: "rm-4", quantityNeeded: 2 },
    ],
  },
]

function isBrowser() {
  return typeof window !== "undefined"
}

export function getRawMaterials(): RawMaterial[] {
  if (!isBrowser()) return defaultRawMaterials
  const stored = localStorage.getItem(RAW_MATERIALS_KEY)
  if (!stored) {
    localStorage.setItem(RAW_MATERIALS_KEY, JSON.stringify(defaultRawMaterials))
    return defaultRawMaterials
  }
  return JSON.parse(stored)
}

export function saveRawMaterials(materials: RawMaterial[]) {
  if (!isBrowser()) return
  localStorage.setItem(RAW_MATERIALS_KEY, JSON.stringify(materials))
}

export function getProducts(): Product[] {
  if (!isBrowser()) return defaultProducts
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts))
    return defaultProducts
  }
  return JSON.parse(stored)
}

export function saveProducts(products: Product[]) {
  if (!isBrowser()) return
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

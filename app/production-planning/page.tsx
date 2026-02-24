"use client"

import { useState, useEffect, useMemo } from "react"
import { Calculator, TrendingUp, Package, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import type { Product, RawMaterial, ProductionPlanItem } from "@/lib/types"
import { getProducts, getRawMaterials } from "@/lib/store"

function calculateProductionPlan(
  products: Product[],
  rawMaterials: RawMaterial[]
): ProductionPlanItem[] {
  // Sort products by price descending (highest value first)
  const sorted = [...products].sort((a, b) => b.price - a.price)

  // Create a map of available stock (mutable copy)
  const availableStock = new Map<string, number>()
  rawMaterials.forEach((rm) => availableStock.set(rm.id, rm.stockQuantity))

  const plan: ProductionPlanItem[] = []

  for (const product of sorted) {
    if (product.billOfMaterials.length === 0) continue

    // Calculate max quantity we can produce based on available stock
    let maxQty = Infinity

    for (const bomItem of product.billOfMaterials) {
      const available = availableStock.get(bomItem.rawMaterialId) || 0
      const possibleFromThis = Math.floor(available / bomItem.quantityNeeded)
      maxQty = Math.min(maxQty, possibleFromThis)
    }

    if (maxQty === Infinity || maxQty <= 0) {
      plan.push({
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        maxQuantity: 0,
        unitPrice: product.price,
        totalValue: 0,
      })
      continue
    }

    // Deduct the consumed materials from available stock
    for (const bomItem of product.billOfMaterials) {
      const current = availableStock.get(bomItem.rawMaterialId) || 0
      availableStock.set(
        bomItem.rawMaterialId,
        current - maxQty * bomItem.quantityNeeded
      )
    }

    plan.push({
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      maxQuantity: maxQty,
      unitPrice: product.price,
      totalValue: maxQty * product.price,
    })
  }

  return plan
}

export default function ProductionPlanningPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [planCalculated, setPlanCalculated] = useState(false)

  useEffect(() => {
    setProducts(getProducts())
    setRawMaterials(getRawMaterials())
  }, [])

  const plan = useMemo(() => {
    if (!planCalculated) return []
    return calculateProductionPlan(products, rawMaterials)
  }, [products, rawMaterials, planCalculated])

  const totalProductionValue = plan.reduce(
    (sum, item) => sum + item.totalValue,
    0
  )
  const totalUnits = plan.reduce((sum, item) => sum + item.maxQuantity, 0)
  const producibleProducts = plan.filter((item) => item.maxQuantity > 0).length

  const handleCalculate = () => {
    setProducts(getProducts())
    setRawMaterials(getRawMaterials())
    setPlanCalculated(true)
  }

  return (
    <>
      <PageHeader
        title="Production Planning"
        description="Calculate optimal production based on available raw materials"
      >
        <Button onClick={handleCalculate} size="sm">
          <Calculator className="size-4" />
          Calculate Plan
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        {!planCalculated ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                <Calculator className="size-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  Ready to Plan
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mt-1">
                  Click &quot;Calculate Plan&quot; to analyze available raw
                  materials and determine optimal production quantities,
                  prioritizing highest-value products.
                </p>
              </div>
              <Button onClick={handleCalculate}>
                <Calculator className="size-4" />
                Calculate Production Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Production Value
                  </CardTitle>
                  <DollarSign className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    $
                    {totalProductionValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Units
                  </CardTitle>
                  <Package className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    {totalUnits.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Producible Products
                  </CardTitle>
                  <TrendingUp className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    {producibleProducts}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      / {plan.length}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Production Plan Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Production Plan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Priority</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">
                        Max Quantity
                      </TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plan.map((item, index) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <Badge
                            variant={
                              index < 3 ? "default" : "secondary"
                            }
                            className={
                              index < 3
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }
                          >
                            #{index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {item.productCode}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          $
                          {item.unitPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.maxQuantity > 0 ? (
                            <span className="font-mono font-semibold text-foreground">
                              {item.maxQuantity.toLocaleString()}
                            </span>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-destructive text-destructive"
                            >
                              Cannot Produce
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          $
                          {item.totalValue.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} className="font-semibold">
                        Grand Total
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {totalUnits.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-lg">
                        $
                        {totalProductionValue.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  )
}

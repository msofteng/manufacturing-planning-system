"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Package,
  Layers,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PageHeader } from "@/components/page-header"
import type { Product, RawMaterial } from "@/lib/types"
import { getProducts, getRawMaterials } from "@/lib/store"

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])

  useEffect(() => {
    setProducts(getProducts())
    setRawMaterials(getRawMaterials())
  }, [])

  const totalProductsValue = products.reduce((sum, p) => sum + p.price, 0)
  const totalStockItems = rawMaterials.reduce(
    (sum, rm) => sum + rm.stockQuantity,
    0
  )
  const lowStockMaterials = rawMaterials.filter(
    (rm) => rm.stockQuantity < 100
  )

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your manufacturing system"
      />

      <div className="flex flex-col gap-6 p-4 md:p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {products.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Registered in system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Raw Materials
              </CardTitle>
              <Layers className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {rawMaterials.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalStockItems.toLocaleString()} total units in stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Catalog Value
              </CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                $
                {totalProductsValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sum of all product prices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Alerts
              </CardTitle>
              <AlertTriangle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {lowStockMaterials.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Materials below 100 units
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Top Products</CardTitle>
                <CardDescription>
                  Highest value products in catalog
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/products">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Materials</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...products]
                    .sort((a, b) => b.price - a.price)
                    .slice(0, 5)
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {product.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {product.code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          $
                          {product.price.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">
                            {product.billOfMaterials.length}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Low Stock Materials */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Stock Alerts</CardTitle>
                <CardDescription>
                  Materials that need restocking
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/raw-materials">
                  View all
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {lowStockMaterials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <TrendingUp className="size-8 text-accent" />
                  <p className="text-sm text-muted-foreground">
                    All materials are well stocked!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {lowStockMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {material.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {material.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-foreground">
                          {material.stockQuantity}
                        </span>
                        {material.stockQuantity === 0 ? (
                          <Badge variant="destructive" className="text-destructive-foreground">
                            Empty
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-chart-3 text-chart-3"
                          >
                            Low
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                <Link href="/products">
                  <Package className="size-5 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Manage Products</span>
                    <span className="text-xs text-muted-foreground">
                      Add, edit or remove products
                    </span>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                <Link href="/raw-materials">
                  <Layers className="size-5 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Manage Materials</span>
                    <span className="text-xs text-muted-foreground">
                      Update stock quantities
                    </span>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start" asChild>
                <Link href="/production-planning">
                  <TrendingUp className="size-5 text-primary" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Plan Production</span>
                    <span className="text-xs text-muted-foreground">
                      Calculate optimal output
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

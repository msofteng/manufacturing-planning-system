"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PageHeader } from "@/components/page-header"
import { ProductDialog } from "@/components/product-dialog"
import { Product, RawMaterial } from "@/lib/mp.entities"
import service from "@/lib/service"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  useEffect(() => {
    service.getProducts().then(setProducts)
    service.getRawMaterials().then(setRawMaterials)
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = useCallback(
    (product: Product) => {
      let updated: Product[]
      const existing = products.find((p) => p.id === product.id)
      if (existing) {
        updated = products.map((p) => (p.id === product.id ? product : p))
        toast.success("Product updated successfully.")
      } else {
        updated = [...products, product]
        toast.success("Product created successfully.")
      }
      setProducts(updated)
      // [TODO]: Atualizar todos os produtos no banco de dados
      // saveProducts(updated)
      setEditingProduct(null)
    },
    [products]
  )

  const handleDelete = useCallback(() => {
    if (!deletingProduct) return
    const updated = products.filter((p) => p.id !== deletingProduct.id)
    setProducts(updated)
    // [TODO]: Atualizar todos os produtos no banco de dados
    // saveProducts(updated)
    setDeleteDialogOpen(false)
    setDeletingProduct(null)
    toast.success("Product deleted.")
  }, [products, deletingProduct])

  const getMaterialName = (code: string) => {
    return rawMaterials.find((rm) => rm.code === code)?.name || "Unknown"
  }

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your products and their bill of materials"
      >
        <Button
          onClick={() => {
            setEditingProduct(null)
            setDialogOpen(true)
          }}
          size="sm"
        >
          <Plus className="size-4" />
          Add Product
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Materials</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">
                        {product.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {product.billOfMaterials.length === 0 ? (
                            <span className="text-muted-foreground text-xs">
                              None
                            </span>
                          ) : (
                            product.billOfMaterials.map((bom, index) => (
                              <Badge
                                key={bom.rawMaterial.code ?? index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {getMaterialName(bom.rawMaterial.code)} ({bom.quantityNeeded})
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                              setEditingProduct(product)
                              setDialogOpen(true)
                            }}
                          >
                            <Pencil className="size-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => {
                              setDeletingProduct(product)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="size-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingProduct?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

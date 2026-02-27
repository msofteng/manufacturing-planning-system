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
import { RawMaterialDialog } from "@/components/raw-material-dialog"
import service from "@/lib/service"
import { RawMaterial } from "@/lib/mp.entities"

export default function RawMaterialsPage() {
  const [materials, setMaterials] = useState<RawMaterial[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(
    null
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingMaterial, setDeletingMaterial] = useState<RawMaterial | null>(
    null
  )

  useEffect(() => {
    service.getRawMaterials().then(setMaterials)
  }, [])

  const filtered = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = useCallback(
    (material: RawMaterial) => {
      let updated: RawMaterial[]
      const existing = materials.find((m) => m.id === material.id)
      if (existing) {
        updated = materials.map((m) => (m.id === material.id ? material : m))
        toast.success("Raw material updated successfully.")
      } else {
        updated = [...materials, material]
        toast.success("Raw material created successfully.")
      }
      setMaterials(updated)
      // [TODO]: Atualizar todas as matérias primas no banco de dados
      // saveRawMaterials(updated)
      setEditingMaterial(null)
    },
    [materials]
  )

  const handleDelete = useCallback(() => {
    if (!deletingMaterial) return
    const updated = materials.filter((m) => m.id !== deletingMaterial.id)
    setMaterials(updated)
    // [TODO]: Atualizar todas as matérias primas no banco de dados
    // saveRawMaterials(updated)
    setDeleteDialogOpen(false)
    setDeletingMaterial(null)
    toast.success("Raw material deleted.")
  }, [materials, deletingMaterial])

  const getStockBadge = (qty: number) => {
    if (qty === 0)
      return (
        <Badge variant="destructive">
          Out of Stock
        </Badge>
      )
    if (qty < 100)
      return (
        <Badge variant="outline" className="border-chart-3 text-chart-3">
          Low Stock
        </Badge>
      )
    return (
      <Badge variant="secondary">In Stock</Badge>
    )
  }

  return (
    <>
      <PageHeader
        title="Raw Materials"
        description="Manage your raw materials inventory"
      >
        <Button
          onClick={() => {
            setEditingMaterial(null)
            setDialogOpen(true)
          }}
          size="sm"
        >
          <Plus className="size-4" />
          Add Material
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
                  <TableHead className="text-right">Stock Qty</TableHead>
                  <TableHead>Status</TableHead>
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
                      No raw materials found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-mono text-sm">
                        {material.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {material.name}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {material.stockQuantity.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStockBadge(material.stockQuantity)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => {
                              setEditingMaterial(material)
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
                              setDeletingMaterial(material)
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

      <RawMaterialDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        material={editingMaterial}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Raw Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingMaterial?.name}</strong>? This action cannot be
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

"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RawMaterial } from "@/lib/types"
import { generateId } from "@/lib/store"

interface RawMaterialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material?: RawMaterial | null
  onSave: (material: RawMaterial) => void
}

export function RawMaterialDialog({
  open,
  onOpenChange,
  material,
  onSave,
}: RawMaterialDialogProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")

  useEffect(() => {
    if (material) {
      setCode(material.code)
      setName(material.name)
      setStockQuantity(material.stockQuantity.toString())
    } else {
      setCode("")
      setName("")
      setStockQuantity("")
    }
  }, [material, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: material?.id || generateId(),
      code,
      name,
      stockQuantity: Number(stockQuantity),
    })
    onOpenChange(false)
  }

  const isEditing = !!material

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Raw Material" : "New Raw Material"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the raw material details below."
              : "Fill in the details for the new raw material."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rm-code">Code</Label>
            <Input
              id="rm-code"
              placeholder="e.g. RM-006"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rm-name">Name</Label>
            <Input
              id="rm-name"
              placeholder="e.g. Carbon Fiber"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="rm-stock">Stock Quantity</Label>
            <Input
              id="rm-stock"
              type="number"
              min="0"
              placeholder="0"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

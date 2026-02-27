"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
// import { generateId } from "@/lib/store"
import { BillOfMaterialItem, Product, RawMaterial } from "@/lib/mp.entities"
import service from "@/lib/service"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSave: (product: Product) => void
}

type BillOfMaterialItemDialog = BillOfMaterialItem & {
  rawMaterialId: number
}

// interface BillOfMaterialItemDialog extends BillOfMaterialItem {
//   rawMaterialId: number;
// }

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
}: ProductDialogProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [bom, setBom] = useState<BillOfMaterialItemDialog[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])

  useEffect(() => {
    service.getRawMaterials().then(setRawMaterials)
  }, [open])

  useEffect(() => {
    if (product) {
      setCode(product.code)
      setName(product.name)
      setPrice(product.price.toString())
      setBom([...product.billOfMaterials.map(bom => ({ ...bom, rawMaterialId: bom.rawMaterial.id }))])
    } else {
      setCode("")
      setName("")
      setPrice("")
      setBom([])
    }
  }, [product, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: product?.id || NaN,
      code,
      name,
      price: Number(price),
      billOfMaterials: bom.filter(
        (item) => item.rawMaterial.id && item.quantityNeeded > 0
      ),
    })
    onOpenChange(false)
  }

  const addBomItem = () => {
    setBom([...bom, {
      id: NaN, rawMaterial: {
        id: NaN,
        code: "",
        name: "",
        stockQuantity: 0
      }, quantityNeeded: 0,
      rawMaterialId: NaN
    }])
  }

  const removeBomItem = (index: number) => {
    setBom(bom.filter((_, i) => i !== index))
  }

  const updateBomItem = (
    index: number,
    field: keyof BillOfMaterialItemDialog,
    value: string | number
  ) => {
    const updated = [...bom]
    if (field === "rawMaterialId") {
      updated[index] = { ...updated[index], rawMaterialId: Number(value) }
    } else {
      updated[index] = { ...updated[index], quantityNeeded: Number(value) }
    }
    setBom(updated)
  }

  const usedMaterialIds = bom.map((item) => item.rawMaterial.id)

  const isEditing = !!product

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product details and its bill of materials."
              : "Fill in the product details and define which raw materials are needed."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-code">Code</Label>
              <Input
                id="prod-code"
                placeholder="e.g. PRD-005"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prod-price">Price ($)</Label>
              <Input
                id="prod-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="prod-name">Name</Label>
            <Input
              id="prod-name"
              placeholder="e.g. Electric Valve"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Bill of Materials</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBomItem}
              >
                <Plus className="size-4" />
                Add Material
              </Button>
            </div>

            {bom.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                No materials added yet. Click &quot;Add Material&quot; to start.
              </p>
            )}

            {bom.map((item, index) => (
              <div
                key={index}
                className="flex items-end gap-2 rounded-lg border border-border bg-secondary/30 p-3"
              >
                <div className="flex flex-1 flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Material
                  </Label>
                  <Select
                    value={item.rawMaterialId.toString()}
                    onValueChange={(val) =>
                      updateBomItem(index, "rawMaterialId", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials
                        .filter(
                          (rm) =>
                            rm.id === item.rawMaterialId ||
                            !usedMaterialIds.includes(rm.id)
                        )
                        .map((rm) => (
                          <SelectItem key={rm.id} value={rm.id.toString()}>
                            {rm.code} - {rm.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-24 flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Qty Needed
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantityNeeded || ""}
                    onChange={(e) =>
                      updateBomItem(index, "quantityNeeded", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0 text-destructive hover:text-destructive"
                  onClick={() => removeBomItem(index)}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
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

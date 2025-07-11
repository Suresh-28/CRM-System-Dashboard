"use client"

import type React from "react"
import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useCRM, type Proposal, type ProposalItem } from "./crm-provider"

interface CreateProposalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedContactId?: string
}

export function CreateProposalModal({ open, onOpenChange, preselectedContactId }: CreateProposalModalProps) {
  const { contacts, addProposal } = useCRM()
  const [formData, setFormData] = useState({
    contactId: preselectedContactId || "",
    title: "",
    description: "",
    currency: "USD",
    validUntil: "",
    terms: "",
  })
  const [items, setItems] = useState<Omit<ProposalItem, "id">[]>([
    { description: "", quantity: 1, unitPrice: 0, total: 0 },
  ])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof Omit<ProposalItem, "id">, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Recalculate total for this item
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice
    }

    setItems(updatedItems)
  }

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedContact = contacts.find((c) => c.id === formData.contactId)
    if (!selectedContact) return

    const proposalItems: ProposalItem[] = items.map((item, index) => ({
      ...item,
      id: `item-${index}`,
    }))

    const proposalData: Omit<Proposal, "id" | "createdAt"> = {
      contactId: formData.contactId,
      contactName: selectedContact.name,
      title: formData.title,
      description: formData.description,
      amount: getTotalAmount(),
      currency: formData.currency,
      status: "draft",
      validUntil: formData.validUntil,
      items: proposalItems,
      terms: formData.terms,
      createdBy: "Current User",
    }

    addProposal(proposalData)

    onOpenChange(false)
    setFormData({
      contactId: "",
      title: "",
      description: "",
      currency: "USD",
      validUntil: "",
      terms: "",
    })
    setItems([{ description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Proposal</DialogTitle>
          <DialogDescription>Create a detailed proposal for a contact.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Select
                value={formData.contactId}
                onValueChange={(value) => setFormData({ ...formData, contactId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
                placeholder="Proposal title"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                rows={3}
                placeholder="Project overview and scope..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validUntil" className="text-right">
                Valid Until
              </Label>
              <Input
                id="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            {/* Proposal Items */}
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Proposal Items</CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        placeholder="Service/product description"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Total</Label>
                      <Input value={`$${item.total.toFixed(2)}`} disabled />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4 border-t">
                  <div className="text-lg font-semibold">
                    Total: ${getTotalAmount().toFixed(2)} {formData.currency}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="terms" className="text-right">
                Terms
              </Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="col-span-3"
                rows={3}
                placeholder="Payment terms, conditions, etc..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Save Draft
            </Button>
            <Button type="submit" disabled={!formData.contactId || !formData.title || items.length === 0}>
              Create Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

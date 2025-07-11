"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCRM, type Contact } from "./crm-provider"

interface AddContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact
  mode?: "add" | "edit"
}

export function AddContactModal({ open, onOpenChange, contact, mode = "add" }: AddContactModalProps) {
  const { addContact, updateContact } = useCRM()
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    company: contact?.company || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    status: contact?.status || ("new" as Contact["status"]),
    source: contact?.source || "",
    rep: contact?.rep || "",
  })

  // Add useEffect to update form data when contact prop changes
  useEffect(() => {
    if (contact && mode === "edit") {
      setFormData({
        name: contact.name,
        company: contact.company,
        email: contact.email,
        phone: contact.phone,
        status: contact.status,
        source: contact.source || "",
        rep: contact.rep || "",
      })
    } else if (!contact) {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "new",
        source: "",
        rep: "",
      })
    }
  }, [contact, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "edit" && contact) {
      updateContact(contact.id, formData)
    } else {
      addContact(formData)
    }
    onOpenChange(false)
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "new",
      source: "",
      rep: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Contact" : "Add New Contact"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Update contact information." : "Add a new contact to your CRM."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Contact["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="col-span-3"
                placeholder="Website, Referral, LinkedIn..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rep" className="text-right">
                Rep
              </Label>
              <Input
                id="rep"
                value={formData.rep}
                onChange={(e) => setFormData({ ...formData, rep: e.target.value })}
                className="col-span-3"
                placeholder="Sales representative"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{mode === "edit" ? "Update" : "Add"} Contact</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

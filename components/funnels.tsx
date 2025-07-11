"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Building, User } from "lucide-react"
import { useCRM, type Contact } from "./crm-provider"
import { AddContactModal } from "./add-contact-modal"

const FUNNEL_STAGES = [
  { key: "new", title: "New", color: "bg-blue-500" },
  { key: "contacted", title: "Contacted", color: "bg-yellow-500" },
  { key: "qualified", title: "Qualified", color: "bg-orange-500" },
  { key: "proposal", title: "Proposal Sent", color: "bg-purple-500" },
  { key: "won", title: "Won", color: "bg-green-500" },
] as const

export function Funnels() {
  const { contacts, updateContactStatus, deleteContact } = useCRM()
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [draggedContact, setDraggedContact] = useState<Contact | null>(null)

  const getContactsByStatus = (status: string) => {
    return contacts.filter((contact) => contact.status === status)
  }

  const handleDragStart = (e: React.DragEvent, contact: Contact) => {
    setDraggedContact(contact)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: Contact["status"]) => {
    e.preventDefault()
    if (draggedContact && draggedContact.status !== newStatus) {
      updateContactStatus(draggedContact.id, newStatus)
    }
    setDraggedContact(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteContact(id)
    }
  }

  const ContactCard = ({ contact }: { contact: Contact }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, contact)}
      className="p-4 bg-card border rounded-lg cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{contact.name}</h4>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Building className="h-3 w-3" />
            <span className="truncate">{contact.company}</span>
          </div>
          {contact.rep && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <User className="h-3 w-3" />
              <span className="truncate">{contact.rep}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingContact(contact)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(contact.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">{contact.email}</div>
    </div>
  )

  const FunnelColumn = ({
    stage,
    contacts,
  }: {
    stage: (typeof FUNNEL_STAGES)[number]
    contacts: Contact[]
  }) => (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
          {stage.title} ({contacts.length})
        </CardTitle>
      </CardHeader>
      <CardContent
        className="space-y-3 min-h-[500px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, stage.key as Contact["status"])}
      >
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
        {contacts.length === 0 && <div className="text-center text-muted-foreground text-sm py-8">No contacts</div>}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sales Funnel</h2>
          <p className="text-muted-foreground">Track leads through your sales pipeline</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {FUNNEL_STAGES.map((stage) => (
          <FunnelColumn key={stage.key} stage={stage} contacts={getContactsByStatus(stage.key)} />
        ))}
      </div>

      <AddContactModal
        open={!!editingContact}
        onOpenChange={(open) => !open && setEditingContact(null)}
        contact={editingContact || undefined}
        mode="edit"
      />
    </div>
  )
}

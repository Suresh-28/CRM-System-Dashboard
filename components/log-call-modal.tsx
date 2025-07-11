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
import { Checkbox } from "@/components/ui/checkbox"
import { useCRM, type CallLog } from "./crm-provider"

interface LogCallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedContactId?: string
}

export function LogCallModal({ open, onOpenChange, preselectedContactId }: LogCallModalProps) {
  const { contacts, addCallLog, addTask } = useCRM()
  const [formData, setFormData] = useState({
    contactId: preselectedContactId || "",
    duration: "",
    outcome: "connected" as CallLog["outcome"],
    notes: "",
    followUpRequired: false,
    followUpDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedContact = contacts.find((c) => c.id === formData.contactId)
    if (!selectedContact) return

    const callLogData: Omit<CallLog, "id" | "createdAt"> = {
      contactId: formData.contactId,
      contactName: selectedContact.name,
      duration: Number.parseInt(formData.duration) || 0,
      outcome: formData.outcome,
      notes: formData.notes,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpRequired ? formData.followUpDate : undefined,
      createdBy: "Current User", // In a real app, this would be the logged-in user
    }

    addCallLog(callLogData)

    // Create follow-up task if required
    if (formData.followUpRequired && formData.followUpDate) {
      addTask({
        title: `Follow up call with ${selectedContact.name}`,
        description: `Follow up on previous call: ${formData.notes.slice(0, 100)}...`,
        priority: "medium",
        status: "upcoming",
        dueDate: new Date(formData.followUpDate).toISOString(),
      })
    }

    onOpenChange(false)
    setFormData({
      contactId: "",
      duration: "",
      outcome: "connected",
      notes: "",
      followUpRequired: false,
      followUpDate: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Call</DialogTitle>
          <DialogDescription>Record details of your phone call with a contact.</DialogDescription>
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
              <Label htmlFor="duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="col-span-3"
                placeholder="15"
                min="0"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="outcome" className="text-right">
                Outcome
              </Label>
              <Select
                value={formData.outcome}
                onValueChange={(value: CallLog["outcome"]) => setFormData({ ...formData, outcome: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                  <SelectItem value="no-answer">No Answer</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="col-span-3"
                rows={4}
                placeholder="Call summary, key points discussed, next steps..."
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Follow-up</Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followUp"
                    checked={formData.followUpRequired}
                    onCheckedChange={(checked) => setFormData({ ...formData, followUpRequired: checked as boolean })}
                  />
                  <Label htmlFor="followUp">Requires follow-up</Label>
                </div>
                {formData.followUpRequired && (
                  <Input
                    type="datetime-local"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!formData.contactId}>
              Log Call
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

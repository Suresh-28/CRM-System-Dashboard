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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useCRM, type CallLog } from "./crm-provider"

interface EditCallLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  callLog: CallLog | null
}

export function EditCallLogModal({ open, onOpenChange, callLog }: EditCallLogModalProps) {
  const { contacts, updateTask } = useCRM()
  const [formData, setFormData] = useState({
    contactId: "",
    duration: "",
    outcome: "connected" as CallLog["outcome"],
    notes: "",
    followUpRequired: false,
    followUpDate: "",
  })

  useEffect(() => {
    if (callLog && open) {
      setFormData({
        contactId: callLog.contactId,
        duration: callLog.duration.toString(),
        outcome: callLog.outcome,
        notes: callLog.notes,
        followUpRequired: callLog.followUpRequired,
        followUpDate: callLog.followUpDate ? new Date(callLog.followUpDate).toISOString().slice(0, 16) : "",
      })
    }
  }, [callLog, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!callLog) return

    // In a real app, you'd have an updateCallLog function
    // For now, we'll just close the modal
    onOpenChange(false)
  }

  if (!callLog) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Call Log</DialogTitle>
          <DialogDescription>Update the details of this call log.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Input value={callLog.contactName} disabled className="col-span-3 bg-muted" />
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
            <Button type="submit">Update Call Log</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

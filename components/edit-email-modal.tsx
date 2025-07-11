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
import { useCRM, type Email } from "./crm-provider"

interface EditEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: Email | null
}

export function EditEmailModal({ open, onOpenChange, email }: EditEmailModalProps) {
  const { updateEmail } = useCRM()
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    status: "draft" as Email["status"],
  })

  useEffect(() => {
    if (email && open) {
      setFormData({
        subject: email.subject,
        body: email.body,
        status: email.status,
      })
    }
  }, [email, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    updateEmail(email.id, {
      subject: formData.subject,
      body: formData.body,
      status: formData.status,
    })

    onOpenChange(false)
  }

  if (!email) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Email</DialogTitle>
          <DialogDescription>Update email content and status.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">
                Contact
              </Label>
              <Input value={`${email.contactName} - ${email.contactEmail}`} disabled className="col-span-3 bg-muted" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Email["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="opened">Opened</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body" className="text-right">
                Message
              </Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                className="col-span-3"
                rows={8}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Update Email</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

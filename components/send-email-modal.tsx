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
import { useCRM, type Email } from "./crm-provider"

const EMAIL_TEMPLATES = {
  introduction: {
    subject: "Introduction - Let's Connect",
    body: `Hi {{name}},

I hope this email finds you well. I wanted to reach out and introduce myself and our services at {{company}}.

We specialize in helping businesses like {{contactCompany}} achieve their goals through innovative solutions.

I'd love to schedule a brief call to discuss how we might be able to help you. Are you available for a 15-minute conversation this week?

Best regards,
{{sender}}`,
  },
  followUp: {
    subject: "Following up on our conversation",
    body: `Hi {{name}},

Thank you for taking the time to speak with me earlier. I wanted to follow up on our conversation about {{topic}}.

As discussed, I'm attaching some additional information that might be helpful for your decision-making process.

Please let me know if you have any questions or if you'd like to schedule another call to discuss next steps.

Best regards,
{{sender}}`,
  },
  proposal: {
    subject: "Proposal for {{contactCompany}}",
    body: `Hi {{name}},

I'm excited to share our proposal for {{contactCompany}}. Based on our discussions, I believe we have a solution that will meet your needs perfectly.

The proposal includes:
- Detailed project scope
- Timeline and milestones
- Investment details
- Next steps

I'm available to discuss any questions you might have. When would be a good time for a call?

Best regards,
{{sender}}`,
  },
}

interface SendEmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedContactId?: string
}

export function SendEmailModal({ open, onOpenChange, preselectedContactId }: SendEmailModalProps) {
  const { contacts, addEmail } = useCRM()
  const [formData, setFormData] = useState({
    contactId: preselectedContactId || "",
    subject: "",
    body: "",
    template: "",
  })

  const handleTemplateChange = (templateKey: string) => {
    if (templateKey && EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES]) {
      const template = EMAIL_TEMPLATES[templateKey as keyof typeof EMAIL_TEMPLATES]
      const selectedContact = contacts.find((c) => c.id === formData.contactId)

      let subject = template.subject
      let body = template.body

      if (selectedContact) {
        subject = subject.replace("{{contactCompany}}", selectedContact.company)
        body = body
          .replace(/{{name}}/g, selectedContact.name)
          .replace(/{{contactCompany}}/g, selectedContact.company)
          .replace(/{{company}}/g, "Your Company")
          .replace(/{{sender}}/g, "Your Name")
          .replace(/{{topic}}/g, "your project")
      }

      setFormData({ ...formData, template: templateKey, subject, body })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedContact = contacts.find((c) => c.id === formData.contactId)
    if (!selectedContact) return

    const emailData: Omit<Email, "id" | "createdAt"> = {
      contactId: formData.contactId,
      contactName: selectedContact.name,
      contactEmail: selectedContact.email,
      subject: formData.subject,
      body: formData.body,
      status: "sent",
      sentAt: new Date().toISOString(),
      createdBy: "Current User",
      templateUsed: formData.template || undefined,
    }

    addEmail(emailData)

    // Simulate email delivery after 2 seconds
    setTimeout(() => {
      // In a real app, you'd update the email status based on actual delivery
    }, 2000)

    onOpenChange(false)
    setFormData({
      contactId: "",
      subject: "",
      body: "",
      template: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>Compose and send an email to a contact.</DialogDescription>
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
                      {contact.name} - {contact.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-right">
                Template
              </Label>
              <Select value={formData.template} onValueChange={handleTemplateChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Choose a template (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="introduction">Introduction Email</SelectItem>
                  <SelectItem value="followUp">Follow-up Email</SelectItem>
                  <SelectItem value="proposal">Proposal Email</SelectItem>
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
                placeholder="Email subject line"
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
                placeholder="Email content..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Save Draft
            </Button>
            <Button type="submit" disabled={!formData.contactId || !formData.subject || !formData.body}>
              Send Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

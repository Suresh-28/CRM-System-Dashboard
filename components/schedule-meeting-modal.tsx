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
import { useCRM, type Meeting } from "./crm-provider"

interface ScheduleMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedContactId?: string
}

export function ScheduleMeetingModal({ open, onOpenChange, preselectedContactId }: ScheduleMeetingModalProps) {
  const { contacts, addMeeting, addTask } = useCRM()
  const [formData, setFormData] = useState({
    contactId: preselectedContactId || "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    meetingType: "video" as Meeting["meetingType"],
    attendees: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedContact = contacts.find((c) => c.id === formData.contactId)
    if (!selectedContact) return

    const meetingData: Omit<Meeting, "id" | "createdAt"> = {
      contactId: formData.contactId,
      contactName: selectedContact.name,
      title: formData.title,
      description: formData.description,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      meetingType: formData.meetingType,
      status: "scheduled",
      attendees: [selectedContact.email, ...formData.attendees],
      createdBy: "Current User",
    }

    addMeeting(meetingData)

    // Create a reminder task
    const reminderTime = new Date(formData.startTime)
    reminderTime.setHours(reminderTime.getHours() - 1) // 1 hour before

    addTask({
      title: `Meeting reminder: ${formData.title}`,
      description: `Meeting with ${selectedContact.name} in 1 hour`,
      priority: "high",
      status: "upcoming",
      dueDate: reminderTime.toISOString(),
    })

    onOpenChange(false)
    setFormData({
      contactId: "",
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      meetingType: "video",
      attendees: [],
    })
  }

  const handleStartTimeChange = (startTime: string) => {
    setFormData({ ...formData, startTime })

    // Auto-set end time to 1 hour later
    if (startTime) {
      const start = new Date(startTime)
      const end = new Date(start.getTime() + 60 * 60 * 1000) // Add 1 hour
      setFormData((prev) => ({
        ...prev,
        startTime,
        endTime: end.toISOString().slice(0, 16),
      }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
          <DialogDescription>Schedule a meeting with a contact.</DialogDescription>
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
                placeholder="Meeting title"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meetingType" className="text-right">
                Type
              </Label>
              <Select
                value={formData.meetingType}
                onValueChange={(value: Meeting["meetingType"]) => setFormData({ ...formData, meetingType: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
                placeholder={
                  formData.meetingType === "video"
                    ? "Zoom/Teams link"
                    : formData.meetingType === "phone"
                      ? "Phone number"
                      : "Address"
                }
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
                placeholder="Meeting agenda, topics to discuss..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!formData.contactId || !formData.title || !formData.startTime}>
              Schedule Meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface Contact {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"
  createdAt: string
  source?: string
  rep?: string
}

export interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "today" | "upcoming" | "completed"
  dueDate: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  sender: string
  recipient: string
  message: string
  timestamp: string
  isGroup: boolean
}

export interface TeamMember {
  id: string
  name: string
  avatar: string
  online: boolean
}

export interface CallLog {
  id: string
  contactId: string
  contactName: string
  duration: number
  outcome: "connected" | "voicemail" | "no-answer" | "busy"
  notes: string
  followUpRequired: boolean
  followUpDate?: string
  createdAt: string
  createdBy: string
}

export interface Email {
  id: string
  contactId: string
  contactName: string
  contactEmail: string
  subject: string
  body: string
  status: "draft" | "sent" | "delivered" | "opened" | "replied"
  sentAt?: string
  createdAt: string
  createdBy: string
  templateUsed?: string
}

export interface Meeting {
  id: string
  contactId: string
  contactName: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  meetingType: "in-person" | "video" | "phone"
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  attendees: string[]
  notes?: string
  createdAt: string
  createdBy: string
}

export interface Proposal {
  id: string
  contactId: string
  contactName: string
  title: string
  description: string
  amount: number
  currency: string
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired"
  validUntil: string
  items: ProposalItem[]
  terms: string
  createdAt: string
  createdBy: string
  sentAt?: string
}

export interface ProposalItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface CRMContextType {
  contacts: Contact[]
  tasks: Task[]
  messages: ChatMessage[]
  teamMembers: TeamMember[]
  callLogs: CallLog[]
  emails: Email[]
  meetings: Meeting[]
  proposals: Proposal[]
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void
  updateContact: (id: string, contact: Partial<Contact>) => void
  deleteContact: (id: string) => void
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  updateContactStatus: (id: string, status: Contact["status"]) => void
  addCallLog: (callLog: Omit<CallLog, "id" | "createdAt">) => void
  addEmail: (email: Omit<Email, "id" | "createdAt">) => void
  updateEmail: (id: string, email: Partial<Email>) => void
  addMeeting: (meeting: Omit<Meeting, "id" | "createdAt">) => void
  updateMeeting: (id: string, meeting: Partial<Meeting>) => void
  addProposal: (proposal: Omit<Proposal, "id" | "createdAt">) => void
  updateProposal: (id: string, proposal: Partial<Proposal>) => void
  updateCallLog: (id: string, callLog: Partial<CallLog>) => void
  updateEmail: (id: string, email: Partial<Email>) => void
  updateMeeting: (id: string, meeting: Partial<Meeting>) => void
  updateProposal: (id: string, proposal: Partial<Proposal>) => void
}

const CRMContext = createContext<CRMContextType | undefined>(undefined)

export function useCRM() {
  const context = useContext(CRMContext)
  if (!context) {
    throw new Error("useCRM must be used within a CRMProvider")
  }
  return context
}

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [callLogs, setCallLogs] = useState<CallLog[]>([])
  const [emails, setEmails] = useState<Email[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [teamMembers] = useState<TeamMember[]>([
    { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", online: true },
    { id: "2", name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32", online: false },
    { id: "3", name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", online: true },
    { id: "4", name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32", online: true },
  ])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem("crm-contacts")
    const savedTasks = localStorage.getItem("crm-tasks")
    const savedMessages = localStorage.getItem("crm-messages")
    const savedCallLogs = localStorage.getItem("crm-call-logs")
    const savedEmails = localStorage.getItem("crm-emails")
    const savedMeetings = localStorage.getItem("crm-meetings")
    const savedProposals = localStorage.getItem("crm-proposals")

    if (savedContacts) {
      setContacts(JSON.parse(savedContacts))
    } else {
      // Initialize with sample data
      const sampleContacts: Contact[] = [
        {
          id: "1",
          name: "Alice Johnson",
          company: "Tech Corp",
          email: "alice@techcorp.com",
          phone: "+1 (555) 123-4567",
          status: "new",
          createdAt: new Date().toISOString(),
          source: "Website",
          rep: "John Doe",
        },
        {
          id: "2",
          name: "Bob Smith",
          company: "Design Studio",
          email: "bob@designstudio.com",
          phone: "+1 (555) 987-6543",
          status: "contacted",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          source: "Referral",
          rep: "Jane Smith",
        },
        {
          id: "3",
          name: "Carol Davis",
          company: "Marketing Inc",
          email: "carol@marketing.com",
          phone: "+1 (555) 456-7890",
          status: "qualified",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          source: "LinkedIn",
          rep: "Mike Johnson",
        },
      ]
      setContacts(sampleContacts)
      localStorage.setItem("crm-contacts", JSON.stringify(sampleContacts))
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Initialize with sample tasks
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Follow up with Alice Johnson",
          description: "Send proposal for website redesign",
          priority: "high",
          status: "today",
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Prepare demo for Bob Smith",
          description: "Create custom demo for Design Studio",
          priority: "medium",
          status: "upcoming",
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString(),
        },
      ]
      setTasks(sampleTasks)
      localStorage.setItem("crm-tasks", JSON.stringify(sampleTasks))
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }

    if (savedCallLogs) {
      setCallLogs(JSON.parse(savedCallLogs))
    }

    if (savedEmails) {
      setEmails(JSON.parse(savedEmails))
    }

    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings))
    }

    if (savedProposals) {
      setProposals(JSON.parse(savedProposals))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("crm-contacts", JSON.stringify(contacts))
  }, [contacts])

  useEffect(() => {
    localStorage.setItem("crm-tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("crm-messages", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem("crm-call-logs", JSON.stringify(callLogs))
  }, [callLogs])

  useEffect(() => {
    localStorage.setItem("crm-emails", JSON.stringify(emails))
  }, [emails])

  useEffect(() => {
    localStorage.setItem("crm-meetings", JSON.stringify(meetings))
  }, [meetings])

  useEffect(() => {
    localStorage.setItem("crm-proposals", JSON.stringify(proposals))
  }, [proposals])

  const addContact = (contactData: Omit<Contact, "id" | "createdAt">) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setContacts((prev) => [...prev, newContact])
  }

  const updateContact = (id: string, contactData: Partial<Contact>) => {
    setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, ...contactData } : contact)))
  }

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...taskData } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const addMessage = (messageData: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const updateContactStatus = (id: string, status: Contact["status"]) => {
    updateContact(id, { status })
  }

  const addCallLog = (callLogData: Omit<CallLog, "id" | "createdAt">) => {
    const newCallLog: CallLog = {
      ...callLogData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setCallLogs((prev) => [...prev, newCallLog])
  }

  const addEmail = (emailData: Omit<Email, "id" | "createdAt">) => {
    const newEmail: Email = {
      ...emailData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setEmails((prev) => [...prev, newEmail])
  }

  const updateEmail = (id: string, emailData: Partial<Email>) => {
    setEmails((prev) => prev.map((email) => (email.id === id ? { ...email, ...emailData } : email)))
  }

  const addMeeting = (meetingData: Omit<Meeting, "id" | "createdAt">) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setMeetings((prev) => [...prev, newMeeting])
  }

  const updateMeeting = (id: string, meetingData: Partial<Meeting>) => {
    setMeetings((prev) => prev.map((meeting) => (meeting.id === id ? { ...meeting, ...meetingData } : meeting)))
  }

  const addProposal = (proposalData: Omit<Proposal, "id" | "createdAt">) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setProposals((prev) => [...prev, newProposal])
  }

  const updateProposal = (id: string, proposalData: Partial<Proposal>) => {
    setProposals((prev) => prev.map((proposal) => (proposal.id === id ? { ...proposal, ...proposalData } : proposal)))
  }

  const updateCallLog = (id: string, callLogData: Partial<CallLog>) => {
    setCallLogs((prev) => prev.map((callLog) => (callLog.id === id ? { ...callLog, ...callLogData } : callLog)))
  }

  const updateEmail2 = (id: string, emailData: Partial<Email>) => {
    setEmails((prev) => prev.map((email) => (email.id === id ? { ...email, ...emailData } : email)))
  }

  const updateMeeting2 = (id: string, meetingData: Partial<Meeting>) => {
    setMeetings((prev) => prev.map((meeting) => (meeting.id === id ? { ...meeting, ...meetingData } : meeting)))
  }

  const updateProposal2 = (id: string, proposalData: Partial<Proposal>) => {
    setProposals((prev) => prev.map((proposal) => (proposal.id === id ? { ...proposal, ...proposalData } : proposal)))
  }

  return (
    <CRMContext.Provider
      value={{
        contacts,
        tasks,
        messages,
        teamMembers,
        callLogs,
        emails,
        meetings,
        proposals,
        addContact,
        updateContact,
        deleteContact,
        addTask,
        updateTask,
        deleteTask,
        addMessage,
        updateContactStatus,
        addCallLog,
        addEmail,
        updateEmail,
        addMeeting,
        updateMeeting,
        addProposal,
        updateProposal,
        updateCallLog,
        updateEmail: updateEmail2,
        updateMeeting: updateMeeting2,
        updateProposal: updateProposal2,
      }}
    >
      {children}
    </CRMContext.Provider>
  )
}

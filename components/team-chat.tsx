"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users } from "lucide-react"
import { useCRM, type TeamMember, type ChatMessage } from "./crm-provider"

export function TeamChat() {
  const { teamMembers, messages, addMessage } = useCRM()
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [messageText, setMessageText] = useState("")
  const [isGroupChat, setIsGroupChat] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const filteredMessages = messages.filter((msg) => {
    if (isGroupChat) {
      return msg.isGroup
    } else if (selectedMember) {
      return (
        (msg.sender === "You" && msg.recipient === selectedMember.name) ||
        (msg.sender === selectedMember.name && msg.recipient === "You")
      )
    }
    return false
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    const newMessage: Omit<ChatMessage, "id" | "timestamp"> = {
      sender: "You",
      recipient: isGroupChat ? "Team" : selectedMember?.name || "",
      message: messageText,
      isGroup: isGroupChat,
    }

    addMessage(newMessage)
    setMessageText("")

    // Simulate responses after a delay
    if (!isGroupChat && selectedMember) {
      setTimeout(
        () => {
          const responses = [
            "Thanks for the update!",
            "Got it, will handle this.",
            "Let me check on that.",
            "Sounds good to me.",
            "I'll get back to you shortly.",
          ]
          const randomResponse = responses[Math.floor(Math.random() * responses.length)]

          addMessage({
            sender: selectedMember.name,
            recipient: "You",
            message: randomResponse,
            isGroup: false,
          })
        },
        1000 + Math.random() * 2000,
      )
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="grid gap-4 md:grid-cols-4 h-[calc(100vh-200px)]">
      {/* Team Members Sidebar */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Team Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Group Chat Option */}
          <div
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
              isGroupChat ? "bg-accent" : "hover:bg-accent/50"
            }`}
            onClick={() => {
              setIsGroupChat(true)
              setSelectedMember(null)
            }}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Team Chat</p>
              <p className="text-xs text-muted-foreground">Everyone</p>
            </div>
          </div>

          {/* Individual Team Members */}
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedMember?.id === member.id && !isGroupChat ? "bg-accent" : "hover:bg-accent/50"
              }`}
              onClick={() => {
                setSelectedMember(member)
                setIsGroupChat(false)
              }}
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                    member.online ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={member.online ? "default" : "secondary"} className="text-xs">
                    {member.online ? "Online" : "Offline"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-3 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="text-sm font-medium">
            {isGroupChat ? "Team Chat" : `Chat with ${selectedMember?.name}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {isGroupChat
                  ? "No team messages yet. Start the conversation!"
                  : selectedMember
                    ? `No messages with ${selectedMember.name} yet.`
                    : "Select a team member to start chatting."}
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] ${message.sender === "You" ? "order-2" : "order-1"}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {!isGroupChat || message.sender === "You" ? null : (
                        <p className="text-xs font-medium mb-1">{message.sender}</p>
                      )}
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">{formatTime(message.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={
                  isGroupChat
                    ? "Type a message to the team..."
                    : selectedMember
                      ? `Message ${selectedMember.name}...`
                      : "Select a team member to chat..."
                }
                disabled={!isGroupChat && !selectedMember}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!messageText.trim() || (!isGroupChat && !selectedMember)}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar } from "lucide-react"
import { useCRM, type Task } from "./crm-provider"
import { AddTaskModal } from "./add-task-modal"

export function TaskKanban() {
  const { tasks, updateTask, deleteTask } = useCRM()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const todayTasks = tasks.filter((t) => t.status === "today")
  const upcomingTasks = tasks.filter((t) => t.status === "upcoming")
  const completedTasks = tasks.filter((t) => t.status === "completed")

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    }
    return <Badge variant={variants[priority] || "default"}>{priority}</Badge>
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { status: newStatus })
    }
    setDraggedTask(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(id)
    }
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className="p-4 bg-card border rounded-lg cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingTask(task)}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDelete(task.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {task.description && <p className="text-xs text-muted-foreground mb-3">{task.description}</p>}
      <div className="flex items-center justify-between">
        {getPriorityBadge(task.priority)}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  )

  const Column = ({
    title,
    tasks,
    status,
    count,
  }: {
    title: string
    tasks: Task[]
    status: Task["status"]
    count: number
  }) => (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          {title} ({count})
        </CardTitle>
      </CardHeader>
      <CardContent
        className="space-y-3 min-h-[400px]"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && <div className="text-center text-muted-foreground text-sm py-8">No tasks</div>}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Column title="Today" tasks={todayTasks} status="today" count={todayTasks.length} />
        <Column title="Upcoming" tasks={upcomingTasks} status="upcoming" count={upcomingTasks.length} />
        <Column title="Completed" tasks={completedTasks} status="completed" count={completedTasks.length} />
      </div>

      <AddTaskModal
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask || undefined}
        mode="edit"
      />
    </div>
  )
}

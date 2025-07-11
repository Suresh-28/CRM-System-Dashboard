"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Calendar, Flag } from "lucide-react"
import { useCRM, type Task } from "./crm-provider"
import { AddTaskModal } from "./add-task-modal"

export function TaskList() {
  const { tasks, updateTask, deleteTask } = useCRM()
  const [editingTask, setEditingTask] = useState<Task | null>(null)

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

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === "completed" ? "today" : "completed"
    updateTask(task.id, { status: newStatus })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(id)
    }
  }

  const TaskItem = ({ task }: { task: Task }) => (
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <Checkbox checked={task.status === "completed"} onCheckedChange={() => handleToggleComplete(task)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </h4>
          {getPriorityBadge(task.priority)}
        </div>
        {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Today Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today ({todayTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No tasks for today</p>
          ) : (
            todayTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Upcoming ({upcomingTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No upcoming tasks</p>
          ) : (
            upcomingTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Completed ({completedTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {completedTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No completed tasks</p>
          ) : (
            completedTasks.map((task) => <TaskItem key={task.id} task={task} />)
          )}
        </CardContent>
      </Card>

      <AddTaskModal
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        task={editingTask || undefined}
        mode="edit"
      />
    </div>
  )
}

// src/components/kanban/Column.jsx
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { MoreVertical } from "lucide-react";
import api from "../../api/axios";
import { TaskCard } from "./TaskCard";

// Column priority color map
const priorityColors = {
  low: {
    header: "",
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-300",
  },
  medium: {
    header: "",
    badge: "bg-amber-100 text-amber-700",
    border: "border-amber-300",
  },
  high: {
    header: "",
    badge: "bg-red-100 text-red-700",
    border: "border-red-300",
  },
};

export function Column({ column, onAddTask, isActive, canManage }) {
  const currentPriority = column.priority || "medium";
  const pr = priorityColors[currentPriority];

  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: `column-${column.id}`,
  });

  const { setNodeRef: dropRef } = useDroppable({
    id: `column-${column.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(column.name);
  const [priority, setPriority] = useState(currentPriority);

  const save = async () => {
    await api.put(`/columns/${column.id}`, {
      name,
      priority,
    });
    window.location.reload();
  };

  const del = async () => {
    if (!confirm("Delete this column?")) return;

    try {
      await api.delete(`/columns/${column.id}`);
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 422) {
        alert("Cannot delete column with tasks.");
      } else if (err.response?.status === 403) {
        alert("Only project owner can delete columns.");
      }
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`
          w-72 border ${pr.border}
          ${isActive ? "ring-2 ring-blue-500" : ""}
        `}
      >
        {/* HEADER = DRAG HANDLE */}
        <CardHeader
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={`
            flex justify-between items-start
            ${pr.header}
            cursor-grab active:cursor-grabbing select-none
          `}
        >
          <div>
            <CardTitle className="text-sm font-semibold text-slate-200">
              {column.name}
            </CardTitle>
            <Badge className={`${pr.badge} text-xs mt-1 capitalize`}>
              {priority} priority
            </Badge>
          </div>
          {canManage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={del} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        {/* BODY = TASK AREA */}
        <CardContent
          ref={dropRef}
          className={`
            p-3 min-h-[120px]
            ${isActive ? "" : ""}
          `}
        >
          <SortableContext
            items={column.tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={(t) => onAddTask(column, t)}
              />
            ))}
          </SortableContext>

          <Button
            size="sm"
            variant="outline"
            className="mt-3 w-full"
            onClick={() => onAddTask(column, null)}
          >
            + Add Task
          </Button>
        </CardContent>
      </Card>

      {/* EDIT COLUMN DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full border rounded-md p-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

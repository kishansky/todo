import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "../../api/axios";

export function TaskDialog({
  open,
  column,
  task,
  projectMembers = [],
  onClose,
  onSaved,
}) {
  const isEdit = !!task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("none");
  const [saving, setSaving] = useState(false);

  /* ✅ Populate form on edit / reset on create */
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setDueDate(task.due_date || "");
      setAssignedTo(
        task.assignee ? task.assignee.id.toString() : "none"
      );
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setAssignedTo("none");
    }
  }, [task, open]);

  if (!open || !column) return null;

  /* ✅ SAVE HANDLER */
  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      setSaving(true);

      const payload = {
        title,
        description,
        priority,
        due_date: dueDate || null,
        assigned_to:
          assignedTo === "none" ? null : assignedTo,
      };

      if (isEdit) {
        // ✅ UPDATE TASK
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        // ✅ CREATE TASK
        await api.post("/tasks", {
          ...payload,
          project_id:
            column.project_id || column.project?.id,
          board_column_id: column.id,
          position: column.tasks.length,
        });
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Save task failed", err);
      alert("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Task" : "New Task"} —{" "}
            {column.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* TITLE */}
          <div>
            <Label className={"mb-2"}>Title</Label>
            <Input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label className={"mb-2"}>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          {/* PRIORITY + DUE DATE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className={"mb-2"}>Priority</Label>
              <Select
                value={priority}
                onValueChange={setPriority}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Low
                  </SelectItem>
                  <SelectItem value="medium">
                    Medium
                  </SelectItem>
                  <SelectItem value="high">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={"mb-2"}>Due date</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />
            </div>
          </div>

          {/* ASSIGNEE */}
          <div>
            <Label className={"mb-2"}>Assignee</Label>
            <Select
              value={assignedTo}
              onValueChange={setAssignedTo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>

              <SelectContent>
                {/* ✅ MUST NOT BE EMPTY STRING */}
                <SelectItem value="none">
                  Unassigned
                </SelectItem>

                {projectMembers.map((m) => (
                  <SelectItem
                    key={m.id}
                    value={m.id.toString()}
                  >
                    {m.name} ({m.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

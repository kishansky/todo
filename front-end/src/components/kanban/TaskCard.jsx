import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarClock, User } from "lucide-react";

// 🎯 Priority styles
const priorityStyles = {
  low: {
    border: "border-emerald-400",
    bg: "",
    badge: "bg-emerald-100 text-emerald-700",
  },
  medium: {
    border: "border-amber-400",
    bg: "",
    badge: "bg-amber-100 text-amber-700",
  },
  high: {
    border: "border-red-400",
    bg: "",
    badge: "bg-red-100 text-red-700",
  },
};

// ⏰ Due date chip color
const dueBadge = (date) => {
  if (!date) return "bg-slate-100 text-slate-600";

  const now = new Date();
  const due = new Date(date);
  const diff = (due - now) / (1000 * 60 * 60 * 24);

  if (diff < 0) return "bg-red-100 text-red-700";     // overdue
  if (diff < 2) return "bg-amber-100 text-amber-700"; // today / tomorrow
  return "bg-slate-100 text-slate-600";
};

export function TaskCard({ task, onClick, isOverlay = false }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const p = priorityStyles[task.priority] || priorityStyles.medium;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...(!isOverlay ? attributes : {})}
      {...(!isOverlay ? listeners : {})}
      onClick={() => !isOverlay && onClick?.(task)}
      className={`
        p-3 mb-3 rounded-xl border-l-4
        ${p.border} ${p.bg}
        cursor-pointer transition-all
        ${isOverlay ? "shadow-xl scale-105 rotate-1 opacity-95" : "hover:shadow-md"}
      `}
    >
      {/* ---- HEADER ---- */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-sm font-semibold text-slate-200 leading-snug">
          {task.title}
        </h3>

        <Badge className={`${p.badge} text-xs capitalize`}>
          {task.priority}
        </Badge>
      </div>

      {/* ---- DESCRIPTION ---- */}
      {task.description && (
        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* ---- FOOTER ---- */}
      <div className="flex items-center justify-between mt-3">

        {/* LEFT: Assignee */}
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <>
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-slate-400">
                {task.assignee.name}
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <User className="w-3 h-3" />
              Unassigned
            </div>
          )}
        </div>

        {/* RIGHT: Due date */}
        {task.due_date && (
          <Badge
            className={`text-xs flex items-center gap-1 ${dueBadge(
              task.due_date
            )}`}
          >
            <CalendarClock className="w-3 h-3" />
            {new Date(task.due_date).toLocaleDateString()}
          </Badge>
        )}
      </div>
    </Card>
  );
}

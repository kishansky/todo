import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import api from "../api/axios";
import { Column } from "../components/kanban/Column";
import { TaskDialog } from "../components/kanban/TaskDialog";
import { TaskCard } from "../components/kanban/TaskCard";
import { Button } from "@/components/ui/button";
import { AddColumnDialog } from "@/components/kanban/AddColumnDialog";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export function BoardPage() {
  const { id: projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [columns, setColumns] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [activeColumnId, setActiveColumnId] = useState(null);

  const [taskDialog, setTaskDialog] = useState({
    open: false,
    column: null,
    task: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ✅ Fetch board
  const fetchBoard = useCallback(async () => {
    const res = await api.get(`/projects/${projectId}/board`);
    setProject(res.data.project);
    setColumns(res.data.columns);
  }, [projectId]);

  const projectMembers = project?.team?.users || [];
  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // ✅ Open task dialog
  const openTaskDialog = (column, task = null) => {
    setTaskDialog({ open: true, column, task });
  };

  // Helpers
  const findColumnByTaskId = (taskId) =>
    columns.find((c) => c.tasks.some((t) => t.id === Number(taskId)));

  // ✅ Handle drag end (column + task)
  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    setActiveColumnId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // 🔹 1) COLUMN REORDER
    if (activeId.startsWith("column-") && overId.startsWith("column-")) {
      const fromId = Number(activeId.replace("column-", ""));
      const toId = Number(overId.replace("column-", ""));
      if (fromId === toId) return;

      const oldIndex = columns.findIndex((c) => c.id === fromId);
      const newIndex = columns.findIndex((c) => c.id === toId);

      const prev = [...columns];
      const updated = [...columns];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      setColumns(updated);

      try {
        await api.patch(`/columns/${fromId}/move`, {
          to_position: newIndex,
        });
      } catch {
        setColumns(prev);
      }
      return;
    }

    // 🔹 2) TASK MOVE
    const numericActiveId = Number(activeId);
    const fromColumn = findColumnByTaskId(numericActiveId);
    if (!fromColumn || !over) return;

    let toColumn = null;
    let toIndex = 0;

    if (overId.startsWith("column-")) {
      // dropped into empty space of a column
      const colId = Number(overId.replace("column-", ""));
      toColumn = columns.find((c) => c.id === colId);
      toIndex = toColumn.tasks.length;
    } else {
      // dropped on another task
      toColumn = findColumnByTaskId(overId);
      if (!toColumn) return;

      const idx = toColumn.tasks.findIndex((t) => t.id === Number(overId));
      toIndex = idx === -1 ? toColumn.tasks.length : idx;
    }

    const fromIndex = fromColumn.tasks.findIndex(
      (t) => t.id === numericActiveId
    );

    if (fromColumn.id === toColumn.id && fromIndex === toIndex) return;

    const snapshot = JSON.parse(JSON.stringify(columns));

    setColumns((prev) => {
      const next = prev.map((c) => ({
        ...c,
        tasks: [...c.tasks],
      }));
      const src = next.find((c) => c.id === fromColumn.id);
      const dest = next.find((c) => c.id === toColumn.id);
      const [moved] = src.tasks.splice(fromIndex, 1);
      dest.tasks.splice(toIndex, 0, moved);
      return next;
    });

    try {
      await api.patch(`/tasks/${numericActiveId}/move`, {
        to_column_id: toColumn.id,
        to_position: toIndex,
      });
    } catch {
      setColumns(snapshot);
    }
  };

  const userRole = (() => {
  if (!project || !user) return null;

  // ✅ PROJECT OWNER ALWAYS HAS FULL ACCESS
  if (project.owner_id === user.id) {
    return "owner";
  }

  // ✅ TEAM BASED PROJECT
  if (project.team) {
    const member = project.team.users?.find(
      (u) => u.id === user.id
    );

    return member?.role || null; // admin / member
  }

  return null;
})();


  const canManageColumns = userRole === "owner" || userRole === "admin";
  const projectOwnerName =
    project?.owner_id === user?.id ? "You" : project?.owner?.name || "Unknown";
  
  console.log(user);
  

  const isTeamProject = !!project?.team;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="px-6 py-4 border-b border-slate-600 flex justify-between items-center">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Project Name */}
            <h1 className="text-xl font-semibold">{project?.name}</h1>

            {/* TEAM BADGE */}
            {isTeamProject && (
              <Badge variant="secondary">Team: {project.team.name}</Badge>
            )}

            {/* OWNER BADGE */}
            <Badge className="bg-orange-100 text-orange-700">
              Owner: {projectOwnerName}
            </Badge>

            {/* ROLE BADGE */}
            {userRole && (
              <Badge
                className={
                  userRole === "owner"
                    ? "bg-purple-100 text-purple-700"
                    : userRole === "admin"
                    ? "bg-blue-100 text-orange-700"
                    : "bg-slate-100 text-slate-700"
                }
              >
                {userRole}
              </Badge>
            )}
          </div>

          
            <Button size="sm" onClick={fetchBoard}>
              Refresh
            </Button>
          
        </header>

        <main className="flex-1 overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={(e) => {
              const id = String(e.active.id);

              // column drag start
              if (id.startsWith("column-")) {
                const colId = Number(id.replace("column-", ""));
                setActiveColumnId(colId);
                return;
              }

              // task drag start
              const column = findColumnByTaskId(e.active.id);
              const task = column?.tasks.find(
                (t) => t.id === Number(e.active.id)
              );
              setActiveTask(task || null);
            }}
            onDragOver={(e) => {
              if (!e.over) return;
              const overId = String(e.over.id);

              if (overId.startsWith("column-")) {
                const colId = Number(overId.replace("column-", ""));
                setActiveColumnId(colId);
              } else {
                const col = findColumnByTaskId(overId);
                setActiveColumnId(col?.id ?? null);
              }
            }}
            onDragEnd={handleDragEnd}
            onDragCancel={() => {
              setActiveTask(null);
              setActiveColumnId(null);
            }}
          >
            <SortableContext
              items={columns.map((c) => `column-${c.id}`)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-4 p-6 min-w-max">
                {columns.map((column) => (
                  <Column
                    key={column.id}
                    column={column}
                    onAddTask={openTaskDialog}
                    isActive={activeColumnId === column.id}
                    canManage={canManageColumns}
                  />
                ))}
                {canManageColumns && (
                  <AddColumnDialog projectId={projectId} onCreated={fetchBoard} />
                )}
              </div>
            </SortableContext>

            {/* Floating task card */}
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  isOverlay
                  disabled={!canManageColumns}
                />
              )}
            </DragOverlay>
          </DndContext>
        </main>
      </div>

      <TaskDialog
        open={taskDialog.open}
        column={taskDialog.column}
        task={taskDialog.task}
        projectMembers={projectMembers}
        onClose={() => setTaskDialog({ open: false, column: null, task: null })}
        onSaved={fetchBoard}
      />
    </>
  );
}

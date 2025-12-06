<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    /**
     * Return Kanban board data for a project
     */
    public function show(Project $project, Request $request)
    {
        // ✅ Authorization
        $this->authorize('view', $project);

        // ✅ Load all required relations
        $project->load([
            'owner:id,name,email',
            'team:id,name',
            'team.users' => fn ($q) => $q->withPivot('role'),
            'columns' => fn ($q) => $q->orderBy('position'),
            'columns.tasks' => fn ($q) => $q->orderBy('position'),
            'columns.tasks.assignee:id,name,email',
        ]);

        return response()->json([
            'project' => [
                'id'       => $project->id,
                'name'     => $project->name,
                'owner_id' => $project->owner_id,

                // ✅ OWNER INFO
                'owner' => $project->owner ? [
                    'id'    => $project->owner->id,
                    'name'  => $project->owner->name,
                    'email' => $project->owner->email,
                ] : null,

                // ✅ TEAM INFO (if any)
                'team' => $project->team ? [
                    'id'    => $project->team->id,
                    'name'  => $project->team->name,
                    'users' => $project->team->users->map(fn ($u) => [
                        'id'    => $u->id,
                        'name'  => $u->name,
                        'email' => $u->email,
                        'role'  => $u->pivot->role,
                    ]),
                ] : null,
            ],

            // ✅ COLUMNS + TASKS
            'columns' => $project->columns->map(fn ($column) => [
                'id'       => $column->id,
                'name'     => $column->name,
                'position' => $column->position,
                'priority' => $column->priority,

                'tasks' => $column->tasks->map(fn ($task) => [
                    'id'          => $task->id,
                    'title'       => $task->title,
                    'description' => $task->description,
                    'priority'    => $task->priority,
                    'owner_id'    => $task->owner_id,
                    'assigned_to' => $task->assigned_to,
                    'due_date'    => $task->due_date,
                    'position'    => $task->position,

                    // ✅ ASSIGNEE
                    'assignee' => $task->assignee ? [
                        'id'    => $task->assignee->id,
                        'name'  => $task->assignee->name,
                        'email' => $task->assignee->email,
                    ] : null,
                ]),
            ]),
        ]);
    }
}

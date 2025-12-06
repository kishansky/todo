<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\BoardColumn;


class TaskController extends Controller
{
    // ✅ List tasks user can access
    public function index(Request $request)
    {
        $user = $request->user();

        return Task::where('owner_id', $user->id)
            ->orWhereHas('project', function ($q) use ($user) {
                $q->where('owner_id', $user->id)
                  ->orWhereIn('team_id', $user->teams()->pluck('teams.id'));
            })
            ->with('project', 'assignee')
            ->get();
    }

    // ✅ Create task (owner fixed)
public function store(Request $request)
{
    $data = $request->validate([
        'board_column_id' => 'required|exists:board_columns,id',
        'assigned_to'     => 'nullable|exists:users,id',
        'title'           => 'required|string|max:255',
        'description'     => 'nullable|string',
        'priority'        => 'in:low,medium,high',
        'due_date'        => 'nullable|date',
        'position'        => 'nullable|integer|min:0',
    ]);

    // ✅ COLUMN SE PROJECT NIKALO
    $column = BoardColumn::findOrFail($data['board_column_id']);
    $project = $column->project;

    // ✅ AUTHORIZE PROJECT ACCESS
    $this->authorize('view', $project);

    // ✅ DEFAULT POSITION
    $position = $data['position'] ?? $column->tasks()->count();

    $task = Task::create([
        'project_id'      => $project->id,        // ✅ auto set
        'board_column_id' => $column->id,
        'owner_id'        => $request->user()->id,
        'assigned_to'     => $data['assigned_to'] ?? null,
        'title'           => $data['title'],
        'description'     => $data['description'] ?? '',
        'priority'        => $data['priority'] ?? 'medium',
        'due_date'        => $data['due_date'] ?? null,
        'position'        => $position,
    ]);

    return response()->json($task, 201);
}

    // ✅ View single task
    public function show(Task $task)
    {
        $this->authorize('view', $task->project);
        return $task->load('project', 'assignee');
    }

    // ✅ Update task (owner / project owner)
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $task->update(
            $request->only([
                'title',
                'description',
                'priority',
                'due_date',
                'assigned_to',
            ])
        );

        return $task;
    }

    // ✅ Delete task
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(['message' => 'Task deleted']);
    }

    // ✅ ✅ ✅ DRAG & DROP API ✅ ✅ ✅
    public function move(Request $request, Task $task)
    {
        // Authorization (task owner or project owner)
        $this->authorize('update', $task);

        $data = $request->validate([
            'to_column_id' => 'required|exists:board_columns,id',
            'to_position'  => 'required|integer|min:0',
        ]);

        DB::transaction(function () use ($task, $data) {

            // 1️⃣ Fix old column positions (close gap)
            Task::where('board_column_id', $task->board_column_id)
                ->where('position', '>', $task->position)
                ->decrement('position');

            // 2️⃣ Make space in new column
            Task::where('board_column_id', $data['to_column_id'])
                ->where('position', '>=', $data['to_position'])
                ->increment('position');

            // 3️⃣ Move task
            $task->update([
                'board_column_id' => $data['to_column_id'],
                'position'        => $data['to_position'],
            ]);
        });

        return response()->json([
            'message' => 'Task moved successfully',
        ]);
    }
    public function assignee()
{
    return $this->belongsTo(User::class, 'assigned_to');
}
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BoardColumn;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BoardColumnController extends Controller
{
    // ✅ Create column (only project owner)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'project_id' => 'required|exists:projects,id',
            'priority'   => 'nullable|in:low,medium,high',
        ]);

        $project = Project::findOrFail($data['project_id']);

        // ✅ Only owner can create columns
        if ($project->owner_id !== $request->user()->id) {
            abort(403, 'Only project owner can create columns');
        }

        $position = BoardColumn::where('project_id', $project->id)->count();

       $column = BoardColumn::create([
    'name'       => $data['name'],
    'project_id' => $project->id,
    'position'   => $position,
    'priority'   => $data['priority'] ?? 'medium',
]);

        return response()->json($column, 201);
    }

    // ✅ Update name + priority (only owner)
    public function update(Request $request, BoardColumn $column)
    {
        $project = $column->project;

        if ($project->owner_id !== $request->user()->id) {
            abort(403, 'Only project owner can edit columns');
        }

        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'priority' => 'nullable|in:low,medium,high',
        ]);

        $column->update([
            'name'     => $data['name'],
            'priority' => $data['priority'] ?? $column->priority,
        ]);

        return $column;
    }

    // ✅ Prevent delete if tasks exist (only owner)
    public function destroy(Request $request, BoardColumn $column)
    {
        $project = $column->project;

        if ($project->owner_id !== $request->user()->id) {
            abort(403, 'Only project owner can delete columns');
        }

        if ($column->tasks()->exists()) {
            return response()->json([
                'message' => 'Cannot delete column that still has tasks',
            ], 422);
        }

        $column->delete();

        return response()->json(['message' => 'Column deleted']);
    }

    // ✅ Column reorder (drag & drop)
    public function move(Request $request, BoardColumn $column)
    {
        $project = $column->project;

        if ($project->owner_id !== $request->user()->id) {
            abort(403, 'Only project owner can reorder columns');
        }

        $data = $request->validate([
            'to_position' => 'required|integer|min:0',
        ]);

        $toPosition = $data['to_position'];

        DB::transaction(function () use ($column, $toPosition) {
            $projectId = $column->project_id;
            $fromPosition = $column->position;

            if ($toPosition === $fromPosition) {
                return;
            }

            // Shift other columns
            if ($toPosition > $fromPosition) {
                BoardColumn::where('project_id', $projectId)
                    ->whereBetween('position', [$fromPosition + 1, $toPosition])
                    ->decrement('position');
            } else {
                BoardColumn::where('project_id', $projectId)
                    ->whereBetween('position', [$toPosition, $fromPosition - 1])
                    ->increment('position');
            }

            $column->update(['position' => $toPosition]);
        });

        return response()->json(['message' => 'Column moved']);
    }
}

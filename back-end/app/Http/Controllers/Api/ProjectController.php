<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return Project::where('owner_id', $user->id)
            ->orWhereIn('team_id', $user->teams()->pluck('teams.id'))
            ->with('team')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'team_id'     => 'nullable|exists:teams,id',
        ]);

        $project = Project::create([
            ...$data,
            'owner_id' => $request->user()->id,
        ]);

        // ✅ ❌ NO COLUMN CREATION HERE
        // ✅ ProjectObserver will handle default columns

        return response()->json(
            $project->load('columns'),
            201
        );
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);
        return $project->load('columns.tasks');
    }

    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $project->update(
            $request->only('name','description')
        );

        return $project;
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(['message'=>'Project deleted']);
    }
}

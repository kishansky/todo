<?php

namespace App\Observers;

use App\Models\Project;
use App\Models\BoardColumn;

class ProjectObserver
{
    /**
     * Handle the Project "created" event.
     */
    public function created(Project $project): void
    {
        // ✅ Create default Kanban columns
        $columns = [
            ['name' => 'Todo', 'position' => 0],
            ['name' => 'In Progress', 'position' => 1],
            ['name' => 'Done', 'position' => 2],
        ];

        foreach ($columns as $column) {
            BoardColumn::create([
                'project_id' => $project->id,
                'name'       => $column['name'],
                'position'   => $column['position'],
            ]);
        }
    }
}

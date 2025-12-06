<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    public function view(User $user, Task $task): bool
    {
        return $user->can('view', $task->project);
    }

    public function update(User $user, Task $task): bool
    {
        return $task->owner_id === $user->id
            || $task->project->owner_id === $user->id;
    }

    public function delete(User $user, Task $task): bool
    {
        return $task->owner_id === $user->id
            || $task->project->owner_id === $user->id;
    }
}

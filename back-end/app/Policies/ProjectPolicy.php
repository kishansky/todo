<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        if ($project->owner_id === $user->id) {
            return true;
        }

        if ($project->team_id) {
            return $project->team->users()
                ->where('user_id', $user->id)
                ->exists();
        }

        return false;
    }

    public function update(User $user, Project $project): bool
    {
        return $project->owner_id === $user->id;
    }

    public function delete(User $user, Project $project): bool
    {
        return $project->owner_id === $user->id;
    }
}

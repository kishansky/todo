<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    // ✅ Any team member can view
    public function view(User $user, Team $team): bool
    {
        return $team->users()
            ->where('user_id', $user->id)
            ->exists();
    }

    // ✅ Owner OR Admin can manage team
    public function manage(User $user, Team $team): bool
    {
        return
            $team->owner_id === $user->id ||
            $team->users()
            ->where('user_id', $user->id)
            ->where('role', 'admin')
            ->exists();
    }



    // ✅ Only OWNER can update team details
    public function update(User $user, Team $team): bool
    {
        return $team->owner_id === $user->id;
    }

    // ✅ Only OWNER can delete team
    public function delete(User $user, Team $team): bool
    {
        return $team->owner_id === $user->id;
    }
}

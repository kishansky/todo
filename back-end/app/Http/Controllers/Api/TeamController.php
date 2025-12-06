<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TeamInvite;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()
            ->teams()
            ->with(['owner', 'users' => function ($q) {
                $q->withPivot('role');
            }])
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();

        $team = Team::create([
            'name'     => $data['name'],
            'owner_id' => $user->id,
        ]);

        $team->users()->attach($user->id, ['role' => 'owner']);

        return response()->json($team->load('users'), 201);
    }

    public function show(Team $team)
    {
        $this->authorize('view', $team);
        return $team->load('users', 'projects');
    }

    public function update(Request $request, Team $team)
    {
        $this->authorize('update', $team);

        $team->update(
            $request->validate(['name' => 'required|string|max:255'])
        );

        return $team;
    }

    public function destroy(Team $team)
    {
        $this->authorize('delete', $team);

        $team->delete();

        return response()->json(['message' => 'Team deleted']);
    }

    public function addMember(Request $request, Team $team)
    {
        // ✅ Owner OR Admin
        $this->authorize('manage', $team);

        $data = $request->validate([
            'email' => 'required|exists:users,email',
            'role'  => 'required|in:admin,member',
        ]);

        $user = User::where('email', $data['email'])->first();

        // ❌ Prevent adding owner again
        if ($team->users()->where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'User already in team'
            ], 422);
        }

        $team->users()->attach($user->id, [
            'role' => $data['role'],
        ]);

        return response()->json([
            'message' => 'Member added successfully'
        ]);
    }

    public function removeMember(Team $team, User $user)
    {
        $this->authorize('manage', $team);

        // ❌ Cannot remove owner
        if ($team->owner_id === $user->id) {
            return response()->json([
                'message' => 'Cannot remove team owner'
            ], 403);
        }

        $team->users()->detach($user->id);

        return response()->json([
            'message' => 'Member removed'
        ]);
    }

    public function invites(Team $team)
    {
        $this->authorize('manage', $team);

        return $team->invites()->latest()->get();
    }

    public function invite(Request $request, Team $team)
    {
        $this->authorize('manage', $team);

        $data = $request->validate([
            'email' => 'required|email',
            'role'  => 'required|in:admin,member',
        ]);

        // ❌ Already member?
        if ($team->users()->where('email', $data['email'])->exists()) {
            return response()->json([
                'message' => 'User already in team'
            ], 422);
        }

        $invite = TeamInvite::updateOrCreate(
            ['team_id' => $team->id, 'email' => $data['email']],
            ['role' => $data['role'], 'accepted_at' => null],
        );

        // (email sending later)

        return response()->json($invite, 201);
    }

    public function myInvites(Request $request)
    {
        return TeamInvite::where('email', $request->user()->email)
            ->whereNull('accepted_at')
            ->with('team')
            ->get();
    }

    public function acceptInvite(TeamInvite $invite, Request $request)
    {
        if ($invite->email !== $request->user()->email) {
            abort(403);
        }

        DB::transaction(function () use ($invite, $request) {
            $invite->team->users()->attach(
                $request->user()->id,
                ['role' => $invite->role]
            );

            $invite->update([
                'accepted_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Joined team']);
    }

    public function rejectInvite(TeamInvite $invite, Request $request)
    {
        if ($invite->email !== $request->user()->email) {
            abort(403);
        }

        $invite->delete();

        return response()->json(['message' => 'Invite rejected']);
    }

    public function updateMemberRole(Request $request, Team $team, User $user)
{
    // ✅ Only owner OR admin
    $this->authorize('manage', $team);

    $data = $request->validate([
        'role' => 'required|in:admin,member',
    ]);

    // ❌ Owner ka role change allowed nahi
    if ($team->owner_id === $user->id) {
        return response()->json([
            'message' => 'Owner role cannot be changed'
        ], 403);
    }

    // ✅ Ensure user is team member
    if (! $team->users()->where('user_id', $user->id)->exists()) {
        return response()->json([
            'message' => 'User not in team'
        ], 404);
    }

    // ✅ MAIN LINE (pivot update)
    $team->users()->updateExistingPivot($user->id, [
        'role' => $data['role']
    ]);

    return response()->json([
        'message' => 'Role updated successfully'
    ]);
}


}

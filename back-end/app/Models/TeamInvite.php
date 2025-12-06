<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamInvite extends Model
{
    protected $fillable = ['team_id', 'email', 'role', 'accepted_at'];
    protected $dates = ['accepted_at'];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}


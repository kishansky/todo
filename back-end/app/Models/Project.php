<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Team;
use App\Models\BoardColumn;
use App\Models\Task;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'team_id',
        'owner_id',
    ];

    // ✅ Project owner
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // ✅ Team (nullable)
    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    // ✅ Kanban columns (ordered)
    public function columns()
    {
        return $this->hasMany(BoardColumn::class)->orderBy('position');
    }

    // ✅ All tasks (sometimes useful)
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}

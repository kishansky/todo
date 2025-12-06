<?php

namespace App\Providers;

use App\Models\Team;
use App\Models\Project;
use App\Models\Task;
use App\Policies\TeamPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\TaskPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Team::class    => TeamPolicy::class,
        Project::class => ProjectPolicy::class,
        Task::class    => TaskPolicy::class,
    ];
}

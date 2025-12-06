<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\BoardColumnController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('teams', TeamController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);

    Route::get('/projects/{project}/board', [BoardController::class, 'show']);

    Route::patch('/tasks/{task}/move', [TaskController::class, 'move']);
    Route::patch('/columns/{column}/move', [BoardColumnController::class, 'move']);

    // 👇 YE 3 LINES BAHUT IMPORTANT HAIN
    Route::post('/columns', [BoardColumnController::class, 'store']);
    Route::put('/columns/{column}', [BoardColumnController::class, 'update']);
    Route::delete('/columns/{column}', [BoardColumnController::class, 'destroy']);

    Route::post('/teams/{team}/members', [TeamController::class, 'addMember']);
    Route::delete('/teams/{team}/members/{user}', [TeamController::class, 'removeMember']);
    Route::patch(
        '/teams/{team}/members/{user}',
        [TeamController::class, 'updateMemberRole']
    );

    Route::get('/teams/{team}/invites', [TeamController::class, 'invites']);
    Route::post('/teams/{team}/invites', [TeamController::class, 'invite']);

    Route::get('/my-invites', [TeamController::class, 'myInvites']);
    Route::post('/invites/{invite}/accept', [TeamController::class, 'acceptInvite']);
    Route::delete('/invites/{invite}', [TeamController::class, 'rejectInvite']);
});

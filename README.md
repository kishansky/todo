# 🗂️ Ziraboard — Team-Based Project Management System

Ziraboard is a complete Kanban-style project management system like **Trello, Jira, Linear**, featuring:

- ✔ Teams & member roles  
- ✔ Invite system (accept/reject)  
- ✔ Projects (personal + team-based)  
- ✔ Kanban board with columns & tasks  
- ✔ Drag & drop (smooth DndKit)  
- ✔ Permissions (Owner / Admin / Member)  
- ✔ Task priority, due date, assignee, etc.

---

# 🚀 Features Overview

## 👥 Team System
- Create teams  
- Invite members (email-based)  
- Owner/Admin can:
  - Promote/demote members (admin ⇄ member)
  - Remove members  
  - View pending invites  
- Members join only via **accept invite**

---

## 📁 Projects
- Create personal or team projects  
- All team members can view team projects  
- Project displays:
  - Team info  
  - Owner info  
  - Member list  

---

## 🗂️ Kanban Board
- Create columns  
- Reorder columns  
- Create tasks  
- Move tasks between columns  
- Drag & drop animations  
- Smart column highlighting  
- Role-based editing  

---

## 📝 Tasks
Each task contains:

- Title  
- Description  
- Priority (low / medium / high)  
- Due date  
- Assignee (team members)  
- Owner (task creator)  

Task card UI includes:

- Priority badge  
- Description preview  
- Assigned user info  
- Gradient + shadows for clarity  

---

# ⚙️ Tech Stack

## Frontend
- React (Vite)  
- shadcn/ui  
- Axios  
- React Router  
- DndKit  
- Context API for auth  

## Backend
- Laravel 10  
- Sanctum Authentication  
- Policies (Team, Project, Task)  
- MySQL  

---

# 📂 Folder Structure

## Frontend (`src/`)
```
src/
 ├─ api/
 │   └─ axios.js
 │
 ├─ components/
 │   ├─ kanban/
 │   │   ├─ Column.jsx
 │   │   ├─ TaskCard.jsx
 │   │   ├─ TaskDialog.jsx
 │   │   └─ AddColumnDialog.jsx
 │   └─ teams/
 │       └─ InvitesPanel.jsx
 │
 ├─ context/
 │   └─ AuthContext.jsx
 │
 ├─ layout/
 │   └─ ProtectedLayout.jsx
 │
 ├─ pages/
 │   ├─ Login.jsx
 │   ├─ Register.jsx
 │   ├─ HomePage.jsx
 │   ├─ ProjectsPage.jsx
 │   ├─ TeamsPage.jsx
 │   ├─ PendingInvites.jsx
 │   └─ BoardPage.jsx
 │
 └─ App.jsx
```

---

## Backend (`app/`)
```
app/
 ├─ Models/
 │   ├─ User.php
 │   ├─ Team.php
 │   ├─ TeamInvite.php
 │   ├─ Project.php
 │   ├─ BoardColumn.php
 │   └─ Task.php
 │
 ├─ Policies/
 │   ├─ TeamPolicy.php
 │   ├─ ProjectPolicy.php
 │   └─ TaskPolicy.php
 │
 └─ Http/Controllers/Api/
     ├─ AuthController.php
     ├─ TeamController.php
     ├─ ProjectController.php
     ├─ BoardController.php
     ├─ BoardColumnController.php
     └─ TaskController.php
```

---

# 🔌 API Routes Summary

## Auth
```
POST /login
POST /register
POST /logout
GET  /me
```

## Teams
```
GET    /teams
POST   /teams
GET    /teams/{team}
POST   /teams/{team}/invites
GET    /teams/{team}/invites
POST   /invites/{invite}/accept
DELETE /invites/{invite}
POST   /teams/{team}/members
PATCH  /teams/{team}/members/{user}/role
DELETE /teams/{team}/members/{user}
```

## Projects & Board
```
GET  /projects
POST /projects
GET  /projects/{project}
GET  /projects/{project}/board
```

## Columns
```
POST   /columns
PUT    /columns/{column}
PATCH  /columns/{column}/move
DELETE /columns/{column}
```

## Tasks
```
POST   /tasks
PUT    /tasks/{task}
PATCH  /tasks/{task}/move
DELETE /tasks/{task}
```

---

# 🧭 Layout & Navigation

### Sidebar sections:
- Home  
- Projects  
- Teams  
- Invites  

### Breadcrumb Example:
```
Teams → JSON Team → Just 1st Project → Board
```

---

# 🛠 Setup Instructions

## Backend (Laravel)
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

.env updates:
```
SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173
APP_URL=http://127.0.0.1:8000
```

---

## Frontend (React)
```bash
npm install
npm run dev
```

`src/api/axios.js`:
```js
import axios from "axios";

export default axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});
```

---

# 📌 Permission Table

| Action | Owner | Admin | Member |
|--------|--------|--------|--------|
| Invite users | ✔ | ✔ | ✖ |
| Change roles | ✔ | ✔ | ✖ |
| Remove members | ✔ | ✔ | ✖ |
| Create project | ✔ | ✔ | ✔ |
| Manage board | ✔ | ✔ | ✖ |
| Manage tasks | ✔ | ✔ | ✔ |

---

# 🎯 Future Plans
- Activity log (who moved what)  
- Comments inside tasks  
- File uploads  
- Multiple boards per project  
- Dark mode  

---

# 📜 License
MIT License — free for personal or commercial use.


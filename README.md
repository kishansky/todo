# 🗂️ Ziraboard — Team-Based Project Management System

[![Live Demo](https://img.shields.io/badge/Live_Demo-todo.onexcode.com-4ade80?style=for-the-badge&logo=vercel)](https://todo.onexcode.com)
![Laravel](https://img.shields.io/badge/Laravel-10-f9322c?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-00758f?style=for-the-badge&logo=mysql)
![Shadcn/UI](https://img.shields.io/badge/shadcn-ui-000?style=for-the-badge)
![DndKit](https://img.shields.io/badge/DndKit-Drag%20%26%20Drop-6b46c1?style=for-the-badge)
![Sanctum](https://img.shields.io/badge/Laravel-Sanctum-9333ea?style=for-the-badge)

Ziraboard is a complete **team-based project management system** inspired by  
**Trello, Jira, Notion, and Linear**, featuring:

- ✔ Teams & Member Roles  
- ✔ Pending Invites (Accept / Reject)  
- ✔ Team & Personal Projects  
- ✔ Kanban Board with Columns  
- ✔ Tasks with Assignee, Due Date, Priority  
- ✔ Beautiful Drag & Drop  
- ✔ Permissions (Owner / Admin / Member)  
- ✔ Smooth UI powered by *shadcn/ui + TailwindCSS*

---

# 🚀 Features Overview

## 👥 Team System
- Create teams  
- Invite users (email required)  
- Users must **Accept / Reject**  
- Owner/Admin can:
  - Promote/Demote users (admin ⇄ member)  
  - Remove users  
  - View all invites  

---

## 📁 Projects
- Create **personal** or **team** projects  
- All team members see team projects  
- Each project shows:
  - Team info  
  - Owner info  
  - All team members  

---

## 🗂️ Kanban Board
- Add/Edit/Delete columns  
- Column priority (change color)  
- Drag to reorder columns  
- Smooth DnD animations  
- Auto-highlight column during drag  

---

## 📝 Tasks
Includes:

- Title  
- Description  
- Priority badge  
- Due date  
- Assignee (team members)  
- Owner  
- Drag between columns  
- Live reorder  

Task card shows:

- Priority  
- Assignee avatar initials  
- Due date chip  
- Description preview  

---

# ⚙️ Tech Stack

## Frontend
- React (Vite)
- shadcn/ui  
- TailwindCSS  
- Axios  
- React Router  
- DndKit  
- Context API  

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
 ├─ components/
 │   ├─ kanban/
 │   │   ├─ Column.jsx
 │   │   ├─ TaskCard.jsx
 │   │   ├─ TaskDialog.jsx
 │   │   └─ AddColumnDialog.jsx
 │   └─ teams/
 │       └─ InvitesPanel.jsx
 ├─ context/
 │   └─ AuthContext.jsx
 ├─ layout/
 │   └─ ProtectedLayout.jsx
 ├─ pages/
 │   ├─ HomePage.jsx
 │   ├─ ProjectsPage.jsx
 │   ├─ TeamsPage.jsx
 │   ├─ PendingInvites.jsx
 │   ├─ BoardPage.jsx
 │   ├─ Login.jsx
 │   └─ Register.jsx
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
 ├─ Policies/
 │   ├─ TeamPolicy.php
 │   ├─ ProjectPolicy.php
 │   └─ TaskPolicy.php
 └─ Http/Controllers/Api/
     ├─ AuthController.php
     ├─ TeamController.php
     ├─ ProjectController.php
     ├─ BoardController.php
     ├─ BoardColumnController.php
     └─ TaskController.php
```

---

# 🔌 API Routes Overview

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

## Projects
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

# 🧭 Navigation & Layout

### Sidebar Menu (Fixed)
- 🏠 Home  
- 📋 Projects  
- 👥 Teams  
- ✉️ Invites  
- Logout  

### Breadcrumbs Example
```
Teams → JSON Team → First Project → Board
```

---

# 🛠 Installation

## Backend
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Frontend
```bash
npm install
npm run dev
```

`src/api/axios.js`:
```js
export default axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});
```

---

# 🔐 Permissions Overview

| Action | Owner | Admin | Member |
|--------|--------|--------|--------|
| Invite users | ✔ | ✔ | ✖ |
| Change roles | ✔ | ✔ | ✖ |
| Remove members | ✔ | ✔ | ✖ |
| Create project | ✔ | ✔ | ✔ |
| Manage board | ✔ | ✔ | ✖ |
| Manage tasks | ✔ | ✔ | ✔ |

---

# 🌍 Live Demo

### 👉 **https://todo.onexcode.com**

Login/Signup required.

---

# 🎯 Roadmap
- Activity log (who moved what)
- Comments inside tasks
- File uploads
- Multiple boards per project
- Dark mode

---

# 📜 License
MIT — free to use anywhere.


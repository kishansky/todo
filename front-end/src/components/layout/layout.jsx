import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProtectedLayout() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } finally {
      logout();
    }
  };

  const linkClass = ({ isActive }) =>
    cn(
      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition",
      isActive
        ? "bg-blue-100/80 text-orange-600"
        : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
    );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* ✅ FIXED SIDEBAR */}
      <aside className="fixed left-0 top-0 h-screen w-56 border-r border-slate-600 flex flex-col">
        <div className="px-6 py-4 border-b border-slate-600">
          <h1 className="text-xl font-bold text-slate-200">Ziraboard</h1>
          <p className="text-xs text-slate-400 mt-1">Project Management</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink to="/home" className={linkClass}>
            🏠 Home
          </NavLink>

          <NavLink to="/projects" className={linkClass}>
            📋 Projects
          </NavLink>

          <NavLink to="/teams" className={linkClass}>
            👥 Teams
          </NavLink>

          <NavLink to="/invites" className={linkClass}>
            ✉️ Invites
          </NavLink>
        </nav>

        <div className="border-t p-4 border-slate-600">
          <div className="flex flex-row border border-slate-600 p-2 rounded">
            <Avatar className="w-8 h-8 my-auto mr-2">
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
            <p className="text-sm text-slate-200 truncate">{user.name}</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* ✅ MAIN CONTENT AREA */}
      <div className="ml-56 h-screen flex flex-col">
        <main className="flex-1 overflow-y-auto ">
          <Outlet />
          {/* Footer */}
      <footer className="border-t border-white/10 text-center py-4 text-sm text-white/40 ">
        © {new Date().getFullYear()} Ziraboard · Built with ❤️
      </footer>
        </main>
      </div>
    </div>
  );
}

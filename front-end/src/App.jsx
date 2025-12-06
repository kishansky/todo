import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BoardPage } from "./pages/BoardPage";
import ProjectsPage from "./pages/ProjectsPage";
import PendingInvites from "./pages/PendingInvites";
import TeamsPage from "./pages/TeamsPage";
import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthContext";
import ProtectedLayout from "./components/layout/layout";

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ ALL PROTECTED ROUTES */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id/board" element={<BoardPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/invites" element={<PendingInvites />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "../context/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = async () => {
    if (!name.trim()) return;
    try {
      setCreating(true);
      const res = await api.post("/projects", { name });
      setProjects((prev) => [...prev, res.data]);
      setName("");
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className=" border-b border-slate-600 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-200">
            Your Projects
          </h1>
        </div>
      </header>

      {loading ? (
        <div className="min-h-screen p-6">
          <div className="flex flex-row max-w-md">
            <Skeleton className="h-9 w-[23rem] mb-6" />
            <Skeleton className="h-9 w-[5rem] mb-6 ms-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      ) : (
        <main className="p-6">
          {/* Create project */}
          <div className="flex gap-2 mb-6 max-w-md">
            <Input
              placeholder="New project name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button onClick={createProject} disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>

          {/* Projects grid */}
          {projects.length === 0 ? (
            <p className="text-slate-400">
              No projects yet. Create your first one 🚀
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className={`h-full transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                    !project?.team?.name
                      ? "border-orange-500/30 hover:bg-orange-300/5 bg-orange-500/5"
                      : "bg-white/5 hover:bg-gray-800/5"
                  }`}
                  onClick={() => navigate(`/projects/${project.id}/board`)}
                >
                  <CardHeader>
                    <div className="flex flex-row justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      {project.team ? (
                        <Badge variant="secondary">
                          Team: {project.team.name}
                        </Badge>
                      ) : (
                        <Badge>Personal</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-row justify-between">
                      <p className="text-sm text-slate-400">
                        Project ID: {project.id}
                      </p>
                      <p className="text-sm text-slate-400">
                        Created on{" "}
                        {new Date(project?.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      )}
      {/* Content */}
    </div>
  );
}

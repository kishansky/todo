import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InvitesPanel from "@/components/teams/InvitesPanel";
import { useNavigate } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------------- ROLE BADGE ---------------- */
function RoleBadge({ role }) {
  if (!role) return null;

  const map = {
    owner: "bg-purple-100 text-purple-700",
    admin: "bg-blue-100 text-blue-700",
    member: "bg-slate-100 text-slate-700",
  };

  return <Badge className={`${map[role]} capitalize`}>{role}</Badge>;
}

export default function TeamsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");
  const [memberRole, setMemberRole] = useState("member");
  const [memberLoading, setMemberLoading] = useState(false);

  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  /* ---------------- HELPERS ---------------- */

  const myRoleInTeam = (team) => {
    const me = team.users?.find((u) => u.id === user?.id);
    return me?.pivot?.role || (team.owner_id === user?.id ? "owner" : null);
  };

  const canManageMembers = (team) => {
    const role = myRoleInTeam(team);
    return role === "owner" || role === "admin";
  };

  const canEditRole = (team, member) => {
    if (team.owner_id === member.id) return false;
    return myRoleInTeam(team) === "owner";
  };

  /* ---------------- API ---------------- */

  const fetchTeams = async () => {
    setLoading(true);
    const res = await api.get("/teams");
    setTeams(res.data);
    setLoading(false);
  };

  const fetchTeamDetails = async (team) => {
    setSelectedTeam(team);
    setDetailsLoading(true);
    const res = await api.get(`/teams/${team.id}`);
    setTeamDetails(res.data);
    setDetailsLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const createTeam = async () => {
    if (!newTeamName.trim()) return;
    const res = await api.post("/teams", { name: newTeamName });
    setTeams((p) => [...p, res.data]);
    setNewTeamName("");
    setCreateOpen(false);
  };

  /* ✅ INVITE */
  const addMember = async () => {
    if (!memberEmail) return;

    setMemberLoading(true);
    await api.post(`/teams/${teamDetails.id}/invites`, {
      email: memberEmail,
      role: memberRole,
    });

    setMemberEmail("");
    setMemberRole("member");
    setMemberLoading(false);
    alert("Invite sent ✅");
  };

  /* ✅ CHANGE ROLE */
  const changeRole = async (member, role) => {
    await api.patch(`/teams/${teamDetails.id}/members/${member.id}`, { role });
    fetchTeamDetails(teamDetails);
  };

  /* ✅ REMOVE MEMBER */
  const removeMember = async (member) => {
    if (!confirm(`Remove ${member.name}?`)) return;
    await api.delete(`/teams/${teamDetails.id}/members/${member.id}`);
    fetchTeamDetails(teamDetails);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white ">
      <header className=" border-b border-slate-600 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-200">Teams</h1>
        <Button onClick={() => setCreateOpen(true)}>+ Create Team</Button>
      </header>

      <div className="px-6">
        <InvitesPanel />
      </div>

      <div className="grid grid-cols-12 gap-6 px-6 py-4">
        {/* LEFT */}
        <div className="col-span-3 space-y-3">
          {loading ? (
            
                <Skeleton className={"h-28 w-full"} />
              
          ) : (
            teams.map((team) => (
              <Card
                key={team.id}
                onClick={() => fetchTeamDetails(team)}
                className={`cursor-pointer ${
                  selectedTeam?.id === team.id
                    ? "ring-2 ring-orange-500 border-none"
                    : ""
                }`}
              >
                <CardHeader className="flex flex-row justify-between">
                  <div>
                    <CardTitle>{team.name}</CardTitle>

                    <p className="text-sm mt-1">
                      <strong className="text-orange-400">owner:</strong>{" "}
                      {team.owner_id === user?.id ? "You" : team?.owner?.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Created on{" "}
                      {new Date(team.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <RoleBadge role={myRoleInTeam(team)} />
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* RIGHT */}
        <div className="col-span-9">
          {!teamDetails ? (
            <Card>
              <CardContent>Select a team</CardContent>
            </Card>
          ) : detailsLoading ? (
            <Card>
              <CardContent>Loading...</CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex flex-row justify-between">
                  <CardTitle>{teamDetails.name} — Members</CardTitle>
                  {canManageMembers(teamDetails) && (
                    <Button
                      size="sm"
                      className="w-fit"
                      onClick={() => setCreateProjectOpen(true)}
                    >
                      + New Project
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {canManageMembers(teamDetails) && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <Select value={memberRole} onValueChange={setMemberRole}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addMember}>Invite</Button>
                  </div>
                )}

                <div className="border border-slate-600 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {teamDetails.users.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>

                          <TableCell>
                            {canEditRole(teamDetails, member) ? (
                              <Select
                                value={member.pivot.role}
                                onValueChange={(val) => changeRole(member, val)}
                              >
                                <SelectTrigger className="w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="member">Member</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <RoleBadge role={member.pivot.role} />
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            {teamDetails.owner_id === member.id ? (
                              <span className="text-xs text-gray-400">
                                Owner
                              </span>
                            ) : canManageMembers(teamDetails) ? (
                              <Button
                                variant="ghost"
                                className="text-red-500"
                                onClick={() => removeMember(member)}
                              >
                                Remove
                              </Button>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Projects</h3>

                  {teamDetails.projects?.length === 0 ? (
                    <p className="text-sm text-slate-500">No projects yet</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {teamDetails.projects.map((project) => (
                        <Card
                          key={project.id}
                          className="hover:shadow cursor-pointer"
                          onClick={() =>
                            navigate(`/projects/${project.id}/board`)
                          }
                        >
                          <CardHeader>
                            <CardTitle className="text-base">
                              {project.name}
                            </CardTitle>
                            <p className="text-xs text-slate-400">
                              Created{" "}
                              {new Date(
                                project.created_at
                              ).toLocaleDateString()}
                            </p>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* CREATE TEAM */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
          </DialogHeader>
          <Input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <Button onClick={createTeam}>Create</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={createProjectOpen} onOpenChange={setCreateProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />

          <Button
            className="w-full mt-3"
            onClick={async () => {
              await api.post("/projects", {
                name: projectName,
                team_id: teamDetails.id, // ✅ KEY PART
              });
              setProjectName("");
              setCreateProjectOpen(false);
              fetchTeamDetails(teamDetails); // refresh
            }}
          >
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

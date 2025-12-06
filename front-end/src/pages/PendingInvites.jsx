import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PendingInvites() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/my-invites");
      setInvites(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const accept = async (inviteId) => {
    await api.post(`/invites/${inviteId}/accept`);
    fetchInvites();
  };

  const reject = async (inviteId) => {
    await api.delete(`/invites/${inviteId}`);
    fetchInvites();
  };

  return (
    <div className="min-h-screen">
      <header className=" border-b border-slate-600 px-6 py-4 flex justify-between items-center ">
        <h1 className="text-xl font-semibold text-slate-200">Team Invitations</h1>
      </header>

      {loading ? (
        <p className="text-slate-400 m-4">Loading...</p>
      ) : invites.length === 0 ? (
        <p className="text-slate-400 m-4">No pending invites</p>
      ) : (
        <div className="space-y-3 m-4">
          {invites.map((invite) => (
            <Card key={invite.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-base">
                    {invite.team.name}
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    Role:{" "}
                    <Badge className="capitalize">
                      {invite.role}
                    </Badge>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => accept(invite.id)}>
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reject(invite.id)}
                  >
                    Reject
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InvitesPanel() {
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

  const acceptInvite = async (inviteId) => {
    await api.post(`/invites/${inviteId}/accept`);
    fetchInvites();
  };

  const rejectInvite = async (inviteId) => {
    await api.delete(`/invites/${inviteId}`);
    fetchInvites();
  };

  if (loading) {
    return (
      <>
        
      </>
    );
  }

  if (invites.length === 0) return null;

  return (
    // <Card className="mb-6 bg-white">
    //   <CardHeader>
    //     <CardTitle className="text-lg">
    //       Team Invites
    //     </CardTitle>
    //   </CardHeader>
      <div className="space-y-3 my-4">
        {invites.map((invite) => (
          <Card key={invite.id}>
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle className="text-lg">
                    {invite.team.name}
                  </CardTitle>
                  <p className="text-sm text-slate-400 mt-1">
                    Role:{" "}
                    <Badge className="capitalize ms-1">
                      {invite.role}
                    </Badge>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => acceptInvite(invite.id)}>
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectInvite(invite.id)}
                  >
                    Reject
                  </Button>
                </div>
              </CardHeader>
            </Card>
        ))}
      </div>
    // </Card>
  );
}

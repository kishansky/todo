import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Mail,
  PlusCircle,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="px-8 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-4 leading-tight">
          Organize work. <br />
          Collaborate effortlessly.
        </h2>
        <p className="text-white/70 mb-8">
          Ziraboard helps you manage projects, tasks and teams
          with a modern Kanban workflow.
        </p>

        <div className="flex justify-center gap-4">
          <Link to="/projects">
            <Button size="lg">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              View Projects
            </Button>
          </Link>
          <Link to="/teams">
            <Button size="lg" variant="outline" className={"text-black"}>
              <Users className="mr-2 h-5 w-5" />
              Manage Teams
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick links */}
      <section className="px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <HomeCard
            to="/projects"
            icon={<LayoutDashboard />}
            title="Projects"
            desc="View and manage all your projects"
            action="Go to Projects"
          />

          <HomeCard
            to="/teams"
            icon={<Users />}
            title="Teams"
            desc="Create teams and manage members"
            action="Manage Teams"
          />

          <HomeCard
            to="/invites"
            icon={<Mail />}
            title="Invitations"
            desc="Pending team invitations"
            action="View Invites"
            highlight
          />
        </div>
      </section>

      
    </div>
  );
}

function HomeCard({ to, icon, title, desc, action, highlight }) {
  return (
    <Link to={to}>
      <Card
        className={`h-full transition-all hover:-translate-y-1 hover:shadow-xl ${
          highlight
            ? "border-blue-500/50 bg-blue-500/10"
            : "bg-white/5"
        }`}
      >
        <CardHeader className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-white/60">
            {icon}
          </div>
          <CardTitle className="text-lg text-white">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/70 mb-4">
            {desc}
          </p>
          <Button variant="secondary" size="sm">
            {action}
            <PlusCircle className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

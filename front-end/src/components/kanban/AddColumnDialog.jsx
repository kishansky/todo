import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "../../api/axios";

export function AddColumnDialog({ projectId, onCreated }) {
  const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
      const [priority, setPriority] = useState("medium");
    
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      await api.post("/columns", {
        name,
          project_id: projectId,
        priority:priority
      });
      setName("");
      setOpen(false);
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild >
              
        <Button className={"h-52 w-72 transition-all border border-orange-300 bg-white/5 hover:bg-white/7 hover:text-orange-500 text-orange-700"} variant="outline">+ Add Column</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Column</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Column name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

              <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full border rounded-md p-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
        <Button onClick={submit} disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/register", form);
      localStorage.setItem("token", res.data.token);
      navigate(`/home`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label className={"mb-2"}>Name</Label>
              <Input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className={"mb-2"}>Email</Label>
              <Input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label className={"mb-2"}>Password</Label>
              <Input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            <Button className="w-full" disabled={loading}>Register</Button>
                  </form>
                  <p className="mt-4 text-center">Have already account <Link to={'/login'} className="text-blue-400">Login</Link></p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import axiosInstance from "../../../lib/axios";
import { useRouter } from "next/navigation";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { useAuth } from "../../../lib/authContext";

export default function CreateEmployeePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    user_id: user?.id ?? "",
    first_name: "",
    last_name: "",
    gender: "M",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/employees", form);
      router.push("/employee");
    } catch (error) {
      console.error("Failed to create employee:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <div>
        <Label>First Name</Label>
        <Input name="first_name" value={form.first_name} onChange={handleChange} required />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input name="last_name" value={form.last_name} onChange={handleChange} required />
      </div>
      <div>
        <Label>Gender</Label>
        <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 w-full">
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <Button type="submit">Create Employee</Button>
    </form>
  );
}

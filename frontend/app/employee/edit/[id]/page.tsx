"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../../lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";

export default function EditEmployeePage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    gender: "M",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(`/employees/${id}`);
      setForm({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        gender: response.data.gender,
      });
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/employees/${id}`, form);
      router.push("/employee");
    } catch (error) {
      console.error("Failed to update employee:", error);
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
      <Button type="submit">Update Employee</Button>
    </form>
  );
}

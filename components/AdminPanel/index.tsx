// app/admin/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "../common/types/auth";

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users", { method: "GET" });
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUsers(data.users);
        } else {
          setError(data.error || "Failed to fetch users");
          router.push("/dashboard"); // Redirect if not authorized
        }
      } catch (err) {
        setError("Network error");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [router]);

  const updateRole = async (userId: string, newRole: string) => {
    console.log(userId, newRole);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole })
      });
      const data = await res.json();
      if (res.ok) {
        // Update the specific user's role in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, role: data.user.role } : user
          )
        );
      } else {
        setError(data.error || "Failed to update role");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Panel - Manage Users
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any, index: number) => (
                <tr key={user._id || index} className="border-t">
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

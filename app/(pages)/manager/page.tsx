// app/manager/page.tsx
"use client";
import { User } from "@/components/common/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManagerPortal() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) return <div>Loading...</div>;
  if (user.role !== "manager") return <div>Unauthorized</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Manager Portal</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Manager Tools
          </h2>
          <p>Manage your team and projects here.</p>
          {/* Add manager-specific features */}
        </div>
      </div>
    </div>
  );
}

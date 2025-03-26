// app/dashboard/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "../common/types/auth";

export default function Dashboard() {
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

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.clear();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Role-Based Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline">
              Welcome, {user.fullName} ({user.role})
            </span>
            {user.role === "admin" && (
              <Link href="/admin" className="text-white hover:underline">
                Admin Panel
              </Link>
            )}
            {user.role === "manager" && (
              <Link href="/manager" className="text-white hover:underline">
                Manager Portal
              </Link>
            )}
            <button
              onClick={logout}
              className="bg-white text-blue-600 px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-gray-100 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        {user.role === "admin" && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">
              Admin Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DashboardCard title="Users" value="124" color="blue" />
              <DashboardCard title="Products" value="56" color="green" />
              <DashboardCard title="Orders" value="1,024" color="purple" />
            </div>
          </div>
        )}

        {user.role === "manager" && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">
              Manager Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DashboardCard title="Team Members" value="12" color="green" />
              <DashboardCard title="Projects" value="8" color="blue" />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            <ActivityItem
              text="System updated to version 2.5"
              time="2 hours ago"
            />
            <ActivityItem text="New user registered" time="5 hours ago" />
            <ActivityItem text="Database backup completed" time="1 day ago" />
          </ul>
        </div>
      </div>
    </div>
  );
}

// Helper components remain the same
interface DashboardCardProps {
  title: string;
  value: string;
  color: "blue" | "green" | "purple";
}

function DashboardCard({ title, value, color }: DashboardCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-800",
    green: "bg-green-50 text-green-800",
    purple: "bg-purple-50 text-purple-800"
  };

  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <h3 className="font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

interface ActivityItemProps {
  text: string;
  time: string;
}

function ActivityItem({ text, time }: ActivityItemProps) {
  return (
    <li className="flex items-start">
      <div className="flex-shrink-0 h-2 w-2 mt-2 bg-blue-500 rounded-full"></div>
      <div className="ml-3">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </li>
  );
}

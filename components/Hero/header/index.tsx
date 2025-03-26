// components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/components/common/types/auth";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.clear();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Brand and Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold hover:text-gray-200">
            MyApp
          </Link>
          <Link href="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin" className="hover:text-gray-200">
              Admin Panel
            </Link>
          )}
          {user?.role === "manager" && (
            <Link href="/manager" className="hover:text-gray-200">
              Manager Portal
            </Link>
          )}
        </div>

        {/* Right Side: User Info and Login/Logout */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="hidden sm:inline">
                Welcome, {user.fullName} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

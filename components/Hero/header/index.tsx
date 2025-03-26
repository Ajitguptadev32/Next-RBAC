// components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/components/common/types/auth";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("user");
      setUser(null); // Immediately update state
      router.push("/login"); // Navigate after state update
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
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

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline">
                Welcome, {user.fullName} ({user.role})
              </span>
              <button
                onClick={logout}
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

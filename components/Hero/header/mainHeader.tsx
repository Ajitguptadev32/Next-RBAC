"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const MainHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-secondary/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Interior Design Logo"
              width={50}
              height={50}
            />
            <span className="text-2xl font-bold text-white ml-2">
              Interior Elegance
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          {["Home", "Services", "Portfolio", "About", "Contact"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}>
              <span className="text-white hover:text-primary transition duration-300">
                {item}
              </span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-secondary/90 backdrop-blur-md flex flex-col items-center py-4">
          {["Home", "Services", "Portfolio", "About", "Contact"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}>
              <span
                className="text-white hover:text-primary py-2 transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default MainHeader;

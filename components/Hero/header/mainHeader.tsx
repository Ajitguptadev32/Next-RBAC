"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const MainHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to add background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
              src="/logo.png" // Replace with your logo path
              alt="Interior Design Logo"
              width={50}
              height={50}
              className="mr-2"
            />
            <span className="text-2xl font-bold text-white">
              Interior Elegance
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/">
            <span className="text-white hover:text-primary transition-colors duration-300">
              Home
            </span>
          </Link>
          <Link href="/services">
            <span className="text-white hover:text-primary transition-colors duration-300">
              Services
            </span>
          </Link>
          <Link href="/portfolio">
            <span className="text-white hover:text-primary transition-colors duration-300">
              Portfolio
            </span>
          </Link>
          <Link href="/about">
            <span className="text-white hover:text-primary transition-colors duration-300">
              About
            </span>
          </Link>
          <Link href="/contact">
            <span className="text-white hover:text-primary transition-colors duration-300">
              Contact
            </span>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
      <div
        className={`md:hidden ${
          isOpen ? "block" : "hidden"
        } bg-secondary/90 backdrop-blur-md`}
      >
        <nav className="flex flex-col items-center py-4">
          <Link href="/">
            <span
              className="text-white hover:text-primary py-2 transition-colors duration-300"
              onClick={toggleMenu}
            >
              Home
            </span>
          </Link>
          <Link href="/services">
            <span
              className="text-white hover:text-primary py-2 transition-colors duration-300"
              onClick={toggleMenu}
            >
              Services
            </span>
          </Link>
          <Link href="/portfolio">
            <span
              className="text-white hover:text-primary py-2 transition-colors duration-300"
              onClick={toggleMenu}
            >
              Portfolio
            </span>
          </Link>
          <Link href="/about">
            <span
              className="text-white hover:text-primary py-2 transition-colors duration-300"
              onClick={toggleMenu}
            >
              About
            </span>
          </Link>
          <Link href="/contact">
            <span
              className="text-white hover:text-primary py-2 transition-colors duration-300"
              onClick={toggleMenu}
            >
              Contact
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;
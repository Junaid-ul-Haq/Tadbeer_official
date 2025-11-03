"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <>
      {/* 🔹 Main Navbar */}
      <header
        className={`fixed w-full z-[999] transition-all duration-300 top-0 overflow-visible ${
          isScrolled
            ? "bg-[var(--surface-color)]/95 backdrop-blur-lg border-b border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
            : "bg-[var(--background-color)]/60 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-3 md:px-4 py-2 sm:py-0.5 md:py-0.5 font-poppins overflow-visible">
          {/* ✅ Logo - Allowed to overflow - Bigger on mobile */}
          <Link href="/" className="flex items-center gap-2 sm:gap-1 md:gap-2 overflow-visible relative z-10">
            <div className="relative w-64 sm:w-52 md:w-72 h-28 sm:h-20 md:h-32 flex items-center justify-center overflow-visible">
              <Image
                src="/vedios/Artboard 1 (2).png"
                alt="Tadbeer Logo"
                fill
                sizes="(max-width: 640px) 256px, (max-width: 768px) 208px, 288px"
                className="object-contain drop-shadow-[0_0_12px_rgba(143,194,65,0.4)] hover:scale-110 transition-transform duration-300"
                style={{ mixBlendMode: 'normal', backgroundColor: 'transparent' }}
                priority
              />
            </div>
          </Link>

          {/* Menu Links */}
          <nav className="hidden md:flex items-center gap-10 text-[var(--text-color)] font-semibold text-lg">
            <Link
              href="/"
              className="relative group hover:text-[var(--accent-color)] transition-colors"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--accent-color)] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-[var(--accent-color)] transition-colors text-lg">
                Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-[2px] transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute left-0 mt-3 w-56 bg-[var(--surface-color)] border border-white/10 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {["Scholarships", "Grants", "Consultation"].map((item) => (
                  <Link
                    key={item}
                    href={`/user/${item.toLowerCase().replace(" ", "-")}`}
                    className="block px-6 py-3 text-base font-medium text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:text-white transition-colors rounded-md"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="relative group hover:text-[var(--accent-color)] transition-colors"
            >
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--accent-color)] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* ✅ Login / Logout */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 border border-[var(--accent-color)] text-[var(--accent-color)] rounded-md 
                hover:bg-[var(--accent-color)] hover:text-white hover:shadow-[0_0_12px_rgba(24,186,214,0.5)] transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-5 py-2 border border-[var(--primary-color)] text-[var(--primary-color)] rounded-md 
                hover:bg-[var(--primary-color)] hover:text-white hover:shadow-[0_0_12px_rgba(143,194,65,0.5)] transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

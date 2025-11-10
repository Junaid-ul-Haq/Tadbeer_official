"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/redux/slices/authSlice";
export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false); // Prevent hydration mismatch
  
  // Only check auth state after component mounts on client
  const isLoggedIn = mounted ? !!user : false;

  useEffect(() => {
    setMounted(true); // Mark as mounted on client
  }, []);

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

  const handleContactClick = (e) => {
    e.preventDefault();
    
    const scrollToContact = () => {
      const footer = document.getElementById("contact");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth", block: "end" });
      } else {
        // Fallback: scroll to bottom of page
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      }
    };
    
    // If already on home page, scroll to footer immediately
    if (pathname === "/") {
      scrollToContact();
    } else {
      // Navigate to home page first, then scroll after navigation completes
      router.push("/");
      // Use multiple attempts to ensure footer is available after navigation
      const attemptScroll = (attempts = 0) => {
        if (attempts > 10) return; // Max 10 attempts (1 second)
        
        const footer = document.getElementById("contact");
        if (footer) {
          scrollToContact();
        } else {
          setTimeout(() => attemptScroll(attempts + 1), 100);
        }
      };
      setTimeout(() => attemptScroll(), 200);
    }
  };

  return (
    <>
      {/* 🔹 Main Navbar */}
      <header
        className={`fixed w-full z-[999] transition-all duration-300 top-0 left-0 right-0 overflow-visible ${
          isScrolled
            ? "bg-[var(--surface-color)]/95 backdrop-blur-lg border-b border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
            : "bg-[var(--background-color)]/60 backdrop-blur-sm"
        }`}
        style={{ height: '76px' }}
      >
        <div className="w-full flex justify-between items-center px-4 sm:px-3 md:px-0 h-full font-poppins overflow-visible">
          {/* ✅ Logo - Slim and consistent size - Left corner on laptop */}
          <Link href="/" className="flex items-center gap-2 overflow-visible relative z-10 h-full md:ml-6 lg:ml-8">
            <div className="relative w-40 sm:w-44 md:w-48 flex items-center justify-center overflow-visible" style={{ height: '60px' }}>
              <Image
                src="/vedios/F logo.png"
                alt="Tadbeer Logo"
                fill
                sizes="(max-width: 640px) 160px, (max-width: 768px) 176px, 192px"
                className="object-contain drop-shadow-[0_0_12px_rgba(143,194,65,0.4)] hover:scale-110 transition-transform duration-300"
                style={{ mixBlendMode: 'normal', backgroundColor: 'transparent' }}
                priority
              />
            </div>
          </Link>

          {/* Menu Links */}
          <nav className="hidden md:flex items-center gap-8 text-[var(--text-color)] font-semibold text-lg">
            <Link
              href="/"
              className="relative group hover:text-[var(--accent-color)] transition-colors"
            >
              Home
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--accent-color)] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors text-lg font-semibold">
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

              <div className="absolute left-0 mt-3 w-64 bg-[var(--surface-color)] border border-white/10 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {[
                  { label: "Educational Counseling", path: "/user/scholarships" },
                  { label: "Career Pathways", path: "/user/consultation" },
                  { label: "Startup and Innovation Hub", path: "/user/grants" }
                ].map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="block px-6 py-3 text-base font-medium text-[var(--text-color)] hover:bg-[var(--accent-color)] hover:text-white transition-colors rounded-md whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={handleContactClick}
              className="relative group hover:text-[var(--accent-color)] transition-colors cursor-pointer text-lg"
            >
              Contact
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--accent-color)] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* ✅ Login / Logout - Right corner on laptop */}
          <div className="flex items-center gap-3 md:mr-6 lg:mr-8">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 text-base font-semibold border border-[var(--accent-color)] text-[var(--accent-color)] rounded-md 
                hover:bg-[var(--accent-color)] hover:text-white hover:shadow-[0_0_12px_rgba(24,186,214,0.5)] transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2.5 text-base font-semibold border border-[var(--primary-color)] text-[var(--primary-color)] rounded-md 
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

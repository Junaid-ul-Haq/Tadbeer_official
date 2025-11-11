"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Users,
  ClipboardList,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Menu for User
  const userMenu = [
    { name: "Overview", icon: LayoutDashboard, path: "/user" },
    { name: "Education and Guidance", icon: GraduationCap, path: "/user/scholarships" },
    { name: "Career Pathways", icon: MessageSquare, path: "/user/consultation" },
    { name: "Startup and Innovation Hub", icon: Briefcase, path: "/user/grants" },
  ];

  // Menu for Admin
  const adminMenu = [
    { name: "Manage Users", icon: Users, path: "/admin/manage-users" },
    { name: "Education and Guidance", icon: GraduationCap, path: "/admin/scholarships" },
    { name: "Career Pathways", icon: ClipboardList, path: "/admin/consultation" },
    { name: "Startup and Innovation Hub", icon: Briefcase, path: "/admin/grants" },
    { name: "Payments", icon: Wallet, path: "/admin/payments" },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[999] md:hidden p-2 bg-[var(--surface-color)] border border-[var(--outline-color)] rounded-lg text-[var(--accent-color)]"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(mobileOpen || !collapsed) && (
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed md:static top-0 left-0 h-screen z-50 bg-[var(--surface-color)] border-r border-[var(--outline-color)] flex flex-col justify-between shadow-2xl 
              ${collapsed ? "w-20" : "w-64"} transition-all duration-300`}
          >
            {/* Top Section */}
            <div>
              {/* Logo / Title */}
              <div className="flex items-center justify-between p-5 border-b border-[var(--outline-color)]">
                {!collapsed && (
                  <h1 className="text-lg font-bold text-[var(--primary-color)]">
                    {role === "admin" ? "Admin Panel" : "User Dashboard"}
                  </h1>
                )}
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="text-gray-400 hover:text-[var(--accent-color)] transition"
                >
                  {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col mt-6">
                {menuItems.map(({ name, icon: Icon, path }) => {
                  const active = pathname === path; // <- correct comparison
                  return (
                    <Link
                      key={path}
                      href={path} // <- use path directly
                      onClick={() => setMobileOpen(false)} // close mobile menu
                    >
                      <div
                        className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-all ${
                          active
                            ? "bg-[var(--accent-color)] text-white"
                            : "text-gray-300 hover:bg-[var(--accent-color)]/20 hover:text-[var(--accent-color)]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {!collapsed && <span className="font-medium">{name}</span>}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[var(--outline-color)] text-center text-sm text-gray-400">
              {!collapsed && "© 2025 Tadbeer"}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

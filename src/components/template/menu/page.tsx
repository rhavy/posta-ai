"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface MenuPageProps {
  page: string;
}

export function MenuPage({ page }: MenuPageProps) {
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/comunidade" },
    { label: "Login", href: "/login" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md sticky top-0 z-50 w-full"
    >
      <div className="max-w-full mx-auto px-4 py-3 flex justify-center gap-8">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`relative font-medium transition-colors ${
              page === item.href ? "text-blue-600" : "text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}

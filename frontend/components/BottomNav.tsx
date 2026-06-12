"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiTrendingUp, FiUsers, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: FiHome },
    { href: "/products", label: "Products", icon: FiTrendingUp },
    { href: "/team", label: "Team", icon: FiUsers },
    { href: "/mine", label: "Mine", icon: FiUser },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition ${
                isActive ? "text-gold-accent" : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="text-xl" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;

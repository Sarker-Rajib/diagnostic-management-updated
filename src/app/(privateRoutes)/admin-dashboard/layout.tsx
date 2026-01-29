"use client";
import {
  ArrowDownFromLine,
  BanknoteIcon,
  MonitorCheck,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminDashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Admin Dashboard", path: "/admin-dashboard", icon: MonitorCheck },
    {
      name: "Expense",
      path: "/admin-dashboard/expenses",
      icon: ArrowDownFromLine,
    },
    {
      name: "Bill COllection",
      path: "/admin-dashboard/bill-collection",
      icon: BanknoteIcon,
    },
    {
      name: "User Management",
      path: "/admin-dashboard/user-management",
      icon: UserCircle,
    },
  ];

  return (
    <div className="text-black min-h-screen p-2 relative bg-gradient-to-br from-sky-500 via-teal-600 to-cyan-500">
      <div className="relative ">
        {/* {Children} */}
        <div className="me-16 bg-white/30">{children}</div>

        {/* side navbar */}
        <div className="w-16 bg-slate-700 h-screen flex items-center flex-col gap-4 fixed top-0 right-0 py-4">
          {menuItems.map((item, i) => (
            <Link
              title={item.name}
              key={i}
              href={item.path}
              className={`group relative rounded-xl p-3 transition-all duration-300 hover:bg-white/20 ${
                pathname === item.path
                  ? "bg-white/20 shadow-md"
                  : "hover:shadow-lg"
              }`}
            >
              <item.icon
                size={24}
                className={`transition-all duration-300 ${
                  pathname === item.path
                    ? "text-white scale-110"
                    : "text-white/80 group-hover:text-white group-hover:scale-110"
                }`}
              />
              {/* Active indicator */}
              {pathname === item.path && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-md"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import { logOutUser } from "@/services/AuthServices";
import {
  BookPlus,
  CircleDollarSign,
  FlaskConical,
  Home,
  LucideLogOut,
  MonitorCheck,
  NotebookPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const handleUseLogOut = () => {
    logOutUser();
    setTimeout(() => {
      router.push("/login");
    }, 1200);
    toast.success("Logged out successfully!");
  };

  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Register", path: "/register", icon: NotebookPen },
    // {
    //   name: "Prescriptions",
    //   path: "/prescriptions/create",
    //   icon: ClipboardList,
    // },<BookPlus />
    { name: "Billing", path: "/billing", icon: CircleDollarSign },
    { name: "Reporting", path: "/reporting", icon: BookPlus },
    { name: "Patients", path: "/dashboard/patients", icon: Users },
    { name: "Admin Dashboard", path: "/admin-dashboard", icon: MonitorCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-16 bg-gradient-to-b from-teal-700 to-teal-800 h-screen flex flex-col items-center py-8 gap-6 fixed top-0 left-0 shadow-xl z-10">
        {/* Logo/App Name */}
        <div className="mb-8">
          <div className="bg-white/20 p-3 rounded-xl" title="brand Logo">
            <FlaskConical className="text-white" size={24} />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col items-center gap-4 flex-grow">
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

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={handleUseLogOut}
            className="group relative rounded-xl p-3 cursor-pointer transition-all duration-300 hover:bg-red-500/20"
            title="Logout"
          >
            <LucideLogOut
              size={24}
              className="text-white/80 transition-all duration-300 group-hover:text-white group-hover:scale-110"
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16">
        <div>{children}</div>
      </div>
    </div>
  );
}

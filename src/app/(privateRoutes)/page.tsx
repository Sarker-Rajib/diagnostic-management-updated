"use client";
import { logOutUser } from "@/services/AuthServices";
import {
  Home,
  ClipboardList,
  LogOut,
  NotebookPen,
  CircleDollarSign,
  User2,
  PaperclipIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();

  const handleUseLogOut = () => {
    logOutUser();
    setTimeout(() => {
      router.push("/login");
    }, 1200);
    toast.success("Logged out successfully!");
  };

  const menuItems = [
    { name: "Register", path: "/register", icon: NotebookPen },
    { name: "Billing", path: "/billing", icon: CircleDollarSign },
    { name: "Reporting", path: "/reporting", icon: PaperclipIcon },

    {
      name: "Prescriptions",
      path: "/prescriptions",
      icon: ClipboardList,
    },
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Profile", path: "/dashboard/profile", icon: User2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 text-teal-900">
            - Diagnostic Management System -
          </h1>
          <p className="text-teal-600 text-lg">
            Automate your diagnostic operations.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className="group border border-cyan-200 relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Gradient background overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-teal-100 group-hover:bg-white/20 rounded-full transition-all duration-300">
                  <item.icon
                    size={32}
                    className="text-teal-600 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/80 mt-1 transition-colors duration-300">
                  Click to access
                </p>
              </div>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleUseLogOut}
            className="group relative cursor-pointer border border-red-100 overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Red gradient background overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 p-3 bg-red-100 group-hover:bg-white/20 rounded-full transition-all duration-300">
                <LogOut
                  size={32}
                  className="text-red-600 group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
                Log out
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-white/80 mt-1 transition-colors duration-300">
                Sign out of your account
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-teal-700/80">
          <p>© Rajib Sarker</p>
        </div>
      </div>
    </div>
  );
}

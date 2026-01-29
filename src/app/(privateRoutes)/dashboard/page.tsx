import { Home, MonitorCheck, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const menuItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Patients", path: "/dashboard/patients", icon: Users },
    { name: "Bills", path: "/dashboard/bills", icon: MonitorCheck },
    { name: "Admin Dashboard", path: "/admin-dashboard", icon: MonitorCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
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
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
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
        </div>
      </div>
    </div>
  );
}

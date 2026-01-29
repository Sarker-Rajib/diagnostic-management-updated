"use client";

import { CreditCard, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashPage() {
  return (
    <div className="overflow-hidden">
      {/* Content container */}
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
          Admin <span className="text-emerald-300">Dashboard</span>
        </h1>

        <p className="text-lg text-blue-100 mb-10 max-w-lg mx-auto backdrop-blur-sm bg-white/10 rounded-lg p-2 px-8">
          Manage your Expense & Earnings
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <Link
            href="/admin-dashboard/bill-collection"
            className="bg-emerald-500/90 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg 
                 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-emerald-400/30
                 flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            Bill Collection
          </Link>

          <Link
            href="/admin-dashboard/expenses"
            className="bg-white/10 text-nowrap hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl border border-white/20
                 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm
                 flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Expenses
          </Link>

          <Link
            href="/admin-dashboard/user-management"
            className="bg-white/10 text-nowrap hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl border border-white/20
                 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm
                 flex items-center justify-center gap-2"
          >
            <Users size={20} />
            User Management
          </Link>

          <Link
            href="/admin-dashboard/service-management"
            className="bg-white/10 text-nowrap hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl border border-white/20
                 transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm
                 flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Service Management
          </Link>
        </div>
      </div>
    </div>
  );
}

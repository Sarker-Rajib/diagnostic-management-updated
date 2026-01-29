"use client";
import { getCurrentUser } from "@/services/AuthServices";
import { ITokenUser } from "@/types";
import { KeyRound, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function PatientsPage() {
  const [user, setUser] = useState<ITokenUser>();

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-3 bg-teal-100 rounded-full">
            <Users size={32} className="text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-teal-800">
            Profile Management
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-teal-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Your Information
            </h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="border border-teal-400 p-1 px-2">User ID</td>
                  <td className="border border-teal-400 p-1 px-2">
                    {user?.userId}
                  </td>
                </tr>
                <tr>
                  <td className="border border-teal-400 p-1 px-2">Username</td>
                  <td className="border border-teal-400 p-1 px-2">
                    {user?.username}
                  </td>
                </tr>
                <tr>
                  <td className="border border-teal-400 p-1 px-2">Full Name</td>
                  <td className="border border-teal-400 p-1 px-2">
                    {user?.fullName}
                  </td>
                </tr>
                <tr>
                  <td className="border border-teal-400 p-1 px-2">
                    Designation
                  </td>
                  <td className="border border-teal-400 p-1 px-2">
                    {user?.position}
                  </td>
                </tr>

                <tr>
                  <td className="border border-teal-400 p-1 px-2">Role</td>
                  <td className="border border-teal-400 p-1 px-2">
                    {user?.role}
                  </td>
                </tr>

                <tr>
                  <td className="border border-teal-400 p-1 px-2">
                    Permissions
                  </td>
                  <td className="border border-teal-400 p-1 px-2">
                    <ul>
                      {user?.permissions.map((p, i) => (
                        <li key={i}>- {p}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <button
              className="bg-emerald-500/90 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg 
                 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-emerald-400/30
                 flex items-center justify-center gap-2"
            >
              <KeyRound size={20} />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

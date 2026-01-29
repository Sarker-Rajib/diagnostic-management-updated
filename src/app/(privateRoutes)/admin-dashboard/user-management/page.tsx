"use client";
import { useEffect, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { envConfig } from "@/config/envConfig";
import { accessToken } from "@/services/AuthServices";
import { IUserData } from "@/types";
import { toast } from "sonner";
import { AddUserForm } from "@/components/Forms/UserAddForm";

const UserHandlePage = () => {
  const [createUser, setCreateUser] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<IUserData> | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await accessToken();
        const delayDebounce = setTimeout(async () => {
          try {
            const response = await fetch(`${envConfig.baseApi}/user`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            });

            const data = await response.json();
            if (data.success) {
              toast.success(`${data.message}`);
              setUsers(data?.data || []);
            } else {
              toast.error(`${data.message}`);
            }
          } catch (error) {
            console.error("Error fetching expenses:", error);
            // Consider setting an error state here
          }
        }, 300);

        return () => clearTimeout(delayDebounce);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    fetchUsers();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="bg-white rounded-xl overflow-auto">
      {/* Table Controls */}
      <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setCreateUser(true)}
          className="bg-emerald-500/90 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg 
                 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-emerald-400/30
                 flex items-center justify-center gap-2"
        >
          <PlusCircle size={20} />
          Create User
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto px-3 rounded">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">User ID</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Full Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Position</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Permissions</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.userId}</td>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.fullName}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td className="px-4 py-2 border">{user.position}</td>
                <td className="px-4 py-2 border">{user.status}</td>
                <td className="px-4 py-2 border">
                  <ul className="list-disc pl-4">
                    {user.permissions.map((perm) => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(user.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to{" "}
          {/* <span className="font-medium">{filteredExpenses.length}</span> of{" "} */}
          <span className="font-medium">{users?.length}</span> Users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {createUser && <AddUserForm setCreateUser={setCreateUser} />}
    </div>
  );
};

export default UserHandlePage;

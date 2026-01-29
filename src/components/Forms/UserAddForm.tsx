"use client";
import { envConfig } from "@/config/envConfig";
import { constants } from "@/constants";
import { accessToken } from "@/services/AuthServices";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export const AddUserForm = ({
  setCreateUser,
}: {
  setCreateUser: Dispatch<SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Super-Admin",
    position: "",
    fullName: "",
    email: "",
    permissions: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted User:", formData);

    const acc = await accessToken();

    fetch(`${envConfig.baseApi}/user/register-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${acc}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(`${data?.message}`);
        } else {
          toast.error(`${data?.message}`);
        }
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4 overflow-auto">
      <div className="w-full relative max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <button
          onClick={() => setCreateUser(false)}
          className="absolute top-4 right-4 border rounded-md border-teal-500 text-amber-600"
        >
          <X />
        </button>
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4"
        >
          <h2 className="text-xl font-bold mb-4 text-teal-600">
            <Plus className="inline" /> Add New User
          </h2>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                User name
              </label>
              <input
                name="username"
                type="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Position
              </label>
              <input
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-[10px]"
              >
                {constants.roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-teal-600 block text-sm font-medium mb-2">
                Permissions
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {constants.permissions.map((perm, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={perm}
                      checked={formData.permissions.includes(perm)}
                      onChange={() => handlePermissionToggle(perm)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm">{perm}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="text-end pt-3">
            <button
              type="submit"
              className="bg-teal-700 text-white px-16 py-2 rounded-xl hover:bg-teal-700 transition"
            >
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

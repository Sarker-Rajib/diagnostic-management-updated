"use client";
import { envConfig } from "@/config/envConfig";
import { department, reportGroup } from "@/constants";
import { accessToken } from "@/services/AuthServices";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import FixedPop from "../fixedPop";
import { IServiceData } from "@/interfaces";

export default function ServiceManageForm({
  setIsOpen,
  setReload,
  reload,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setReload?: Dispatch<SetStateAction<boolean>>;
  reload?: boolean;
}) {
  const [accToken, setAcctoken] = useState<string>("");

  useEffect(() => {
    const fetchacctoken = async () => {
      try {
        const token = await accessToken();

        if (token) {
          setAcctoken(token);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Error fetching patients");
      }
    };

    fetchacctoken();
  }, []);

  const [formData, setFormData] = useState<IServiceData>({
    serviceName: "",
    testName: "",
    price: 0,
    department: department[0],
    reportGroup: reportGroup[0],
    // profile: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "serviceCode" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can send formData to your API here services/create

    try {
      const response = await fetch(`${envConfig.baseApi}/services/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accToken,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Patient created successfully");
        setFormData({
          serviceName: "",
          testName: "",
          price: 0,
          department: department[0],
          reportGroup: reportGroup[0],
          // profile: "",
        });
      } else {
        toast.error(`Error creating patient: ${data?.message}`);
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Error creating patient");
    } finally {
      if (setReload) {
        setReload(!reload);
      }
    }
  };

  return (
    <FixedPop>
      <div className="p-2 relative max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-teal-600">
              <Plus className="inline" /> Add New Service
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="border rounded-lg text-red-600"
            >
              <X />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Service Name
              </label>
              <input
                name="serviceName"
                type="text"
                value={formData.serviceName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Test Name
              </label>
              <input
                name="testName"
                type="text"
                value={formData.testName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Price
              </label>

              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onFocus={(e) => e.target.select()}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-teal-600 block text-sm font-medium">
                Department
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                {department.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Report Group</label>
              <select
                name="reportGroup"
                value={formData.reportGroup}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                {reportGroup.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>
            {/* 
            <div>
              <label>Profile (optional)</label>
              <input
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
                type="text"
                name="profile"
                onChange={handleChange}
              />
            </div> */}
          </div>
          <div className="text-end pt-3">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="bg-amber-600 me-3 text-white px-16 py-2 rounded-xl hover:bg-teal-700 transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-teal-700 text-white px-16 py-2 rounded-xl hover:bg-teal-700 transition cursor-pointer"
            >
              Save Service Data
            </button>
          </div>
        </form>
      </div>
    </FixedPop>
  );
}

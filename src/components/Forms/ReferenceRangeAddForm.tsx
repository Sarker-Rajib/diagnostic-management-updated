"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { envConfig } from "@/config/envConfig";
import { toast } from "sonner";
import { X } from "lucide-react";

interface ITestRef {
  refName: string;
  testName: string;
  unit: string;
  referenceRange: string;
  priority?: number;
}

export const TestRefCraeteForm = ({
  setIsOpen,
  setReload,
  reload,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setReload?: Dispatch<SetStateAction<boolean>>;
  reload?: boolean;
}) => {
  const [formData, setFormData] = useState<ITestRef>({
    refName: "",
    testName: "",
    unit: "",
    referenceRange: "",
    priority: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "priority" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      fetch(`${envConfig.baseApi}/reference-value`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `${acc}`,
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.success) {
            toast.success(`${data?.message}`);
            setFormData({
              refName: "",
              testName: "",
              unit: "",
              referenceRange: "",
              priority: 0,
            });

            setIsOpen(false);
            //   if (setNewPatient) {
            //     setNewPatient(data?.data);

            // setSaving(false);
            if (setReload) {
              setReload(!reload);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.success(`${error?.message}`);
          //   setSaving(false);
        });
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-teal-600 px-6 py-4 flex justify-between items-center border border-fuchsia-400">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Create New Test Reference
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Add a new test reference to the laboratory system
            </p>
          </div>
          <button
            className="text-white hover:text-teal-200 transition"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          {/* Header with gradient */}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Reference Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Reference Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="refName"
                  placeholder="e.g., Complete Blood Count"
                  value={formData.refName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                  required
                />
              </div>
            </div>

            {/* Test Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Test Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="testName"
                  placeholder="e.g., Hemoglobin"
                  value={formData.testName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                  required
                />
              </div>
            </div>

            {/* Unit and Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Unit */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Unit
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., g/dL"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                    required
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Priority (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="priority"
                    placeholder="1-10"
                    value={formData.priority}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                  />
                </div>
              </div>
            </div>

            {/* Reference Range */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Reference Range
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <textarea
                  name="referenceRange"
                  placeholder="e.g., 13.5 - 17.5 g/dL (men)&#10;12.0 - 15.5 g/dL (women)"
                  value={formData.referenceRange}
                  onChange={handleChange}
                  // rows="4"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out resize-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You can add multiple ranges, one per line
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition duration-200 ease-in-out flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save Test Reference
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

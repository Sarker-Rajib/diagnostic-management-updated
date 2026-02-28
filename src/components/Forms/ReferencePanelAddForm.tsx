"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { envConfig } from "@/config/envConfig";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { ITestPanel, ITestRefData } from "@/types";
import { accessToken } from "@/services/AuthServices";

export const RefPanelCraeteForm = ({
  setIsOpen,
  setReload,
  reload,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setReload?: Dispatch<SetStateAction<boolean>>;
  reload?: boolean;
}) => {
  const [testRefs, setTestRefs] = useState<ITestRefData[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedRefs, setSelectedRefs] = useState<ITestRefData[]>([]);

  const [formData, setFormData] = useState<Partial<ITestPanel>>({
    refPanelName: "",
    panelName: "",
    priority: 1,
    isPanel: true,
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
    const acc = await accessToken();

    const testIds = selectedRefs.map((item) => item._id);

    const data = {
      ...formData,
      tests: testIds,
    };

    try {
      fetch(`${envConfig.baseApi}/panel-reference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${acc}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.success) {
            toast.success(`${data?.message}`);
            setFormData({
              refPanelName: "",
              panelName: "",
              priority: 1,
              isPanel: true,
            });
            setSelectedRefs([]);
            setIsOpen(false);
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

  const handleRefSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 1) {
      setTestRefs([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetch(`${envConfig.baseApi}/reference-value/lookup?search=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setTestRefs(data?.data || []);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 300);
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black/10 backdrop-blur z-50 p-4 overflow-auto">
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
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Test Panel Name
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
                  name="panelName"
                  placeholder="e.g., Complete Blood Count"
                  value={formData.panelName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                  required
                />
              </div>
            </div>

            {/* Test Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Ref Name
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
                  name="refPanelName"
                  placeholder="e.g: l.profile"
                  value={formData.refPanelName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                  required
                />
              </div>
            </div>
            {/* Reference Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Search Test reference
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="col-span-2 border-2 border-teal-400 rounded-lg flex items-center p-2 bg-gray-50 transition-all focus-within:border-teal-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-200">
                  <input
                    type="text"
                    placeholder="Search testRefs..."
                    onChange={handleRefSearch}
                    onBlur={() => {
                      setTimeout(() => {
                        setTestRefs([]);
                      }, 200);
                    }}
                    className="text-gray-700 px-3 focus:outline-none w-full bg-transparent"
                  />
                  <Search size={20} className="text-teal-600 ml-2" />
                </div>

                {testRefs?.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-amber-300 z-10 border border-rose-300 rounded-lg shadow-xl mt-1 overflow-hidden">
                    <div className="custom-scroll max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-teal-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                              Test Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                              Ref name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                              Priority
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {testRefs?.map((ref, i) => (
                            <tr
                              onClick={() => {
                                setSelectedRefs((prev) => {
                                  // prevent duplicate
                                  if (
                                    prev.some((item) => item._id === ref._id)
                                  ) {
                                    return prev;
                                  }

                                  return [...prev, ref];
                                });
                                setTestRefs([]);
                              }}
                              key={i}
                              className="hover:bg-teal-50 cursor-pointer transition-colors"
                            >
                              <td className="px-4 py-2 text-sm text-teal-600">
                                {ref?.testName}
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-teal-700">
                                {ref?.refName}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                {ref?.priority}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Test Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Selected Items
                <span className="text-red-500">*</span>
              </label>
              <div className="relative min-h-40 bg-amber-50 border rounded p-2">
                <table className="w-full">
                  <tbody>
                    {selectedRefs?.map((ref, i) => (
                      <tr
                        key={i}
                        className="hover:bg-teal-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-2 text-sm font-medium text-teal-600 bg-amber-200">
                          {i + 1}.
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-teal-600 bg-amber-200">
                          {ref?.testName}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-teal-600 bg-amber-200">
                          {ref?.refName}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-teal-600 bg-amber-200">
                          {ref?.unit}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-teal-600 bg-amber-200">
                          {ref?.referenceRange}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-teal-600 bg-amber-200">
                          {ref?.priority}
                        </td>
                        <td className="px-4 text-sm font-medium text-teal-600 bg-amber-200">
                          <span
                            className="text-xl mt-1 border inline-block text-red-500 rounded-sm"
                            title="remove"
                            onClick={() =>
                              setSelectedRefs((prev) =>
                                prev.filter((item) => item !== ref),
                              )
                            }
                          >
                            <X />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Unit and Priority Row */}
            <div className="grid grid-cols-2 gap-4">
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
                    min="1"
                    max="100"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                  />
                </div>
              </div>
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
                Save Test Panel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

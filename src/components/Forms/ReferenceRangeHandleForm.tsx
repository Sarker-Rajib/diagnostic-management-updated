"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { envConfig } from "@/config/envConfig";
import { toast } from "sonner";
import { X } from "lucide-react";
import FixedPop from "../fixedPop";

interface ITestRef {
  refName: string;
  testName: string;
  unit: string;
  referenceRange: string;
  priority?: number;
}

type Props = {
  handleClose: () => void;
  setReload?: Dispatch<SetStateAction<boolean>>;
  reload?: boolean;

  mode: "create" | "update";
  id?: string; // required for update

  initialData?: ITestRef; // for edit
};

export const TestRefForm = ({
  handleClose,
  setReload,
  reload,
  mode,
  id,
  initialData,
}: Props) => {
  const [formData, setFormData] = useState<ITestRef>({
    refName: "",
    testName: "",
    unit: "",
    referenceRange: "",
    priority: 0,
  });

  // ✅ fill data when editing
  useEffect(() => {
    if (mode === "update" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url =
        mode === "create"
          ? `${envConfig.baseApi}/reference-value`
          : `${envConfig.baseApi}/reference-value/update/${id}`;

      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data?.success) {
        toast.success(data?.message);

        setFormData({
          refName: "",
          testName: "",
          unit: "",
          referenceRange: "",
          priority: 0,
        });

        handleClose();

        if (setReload) {
          setReload(!reload);
        }
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <FixedPop>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* HEADER (UNCHANGED STYLE) */}
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

              {mode === "create"
                ? "Create New Test Reference"
                : "Update Test Reference"}
            </h2>

            <p className="text-blue-100 text-sm mt-1">
              {mode === "create"
                ? "Add a new test reference to the laboratory system"
                : "Update existing test reference"}
            </p>
          </div>

          <button
            className="text-white hover:text-teal-200 transition"
            onClick={() => handleClose()}
          >
            <X size={24} />
          </button>
        </div>

        {/* FORM (UNCHANGED UI) */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-6 space-y-2 2xl:space-y-3">
            {/* Test Name */}
            <div className="2xl:space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Test Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="testName"
                value={formData.testName}
                onChange={handleChange}
                className="w-full pl-3 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g. Random Blood Sugar (Rbs)"
              />
            </div>

            {/* Reference Name */}
            <div className="2xl:space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Reference Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="refName"
                value={formData.refName}
                onChange={handleChange}
                className="w-full pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="rbs"
              />
            </div>

            {/* Unit + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="2xl:space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full pl-3 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="e.g. mg/dl"
                  required
                />
              </div>

              <div className="2xl:space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full pl-3 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Reference Range */}
            <div className="2xl:space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Reference range <span className="text-red-500">*</span>
              </label>
              <textarea
                name="referenceRange"
                value={formData.referenceRange}
                onChange={handleChange}
                className="w-full pl-3 py-2.5 border border-gray-300 rounded-lg resize-none"
                required
              />
            </div>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleClose()}
                className="px-5 py-2.5 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg"
              >
                {mode === "create"
                  ? "Save Test Reference"
                  : "Update Test Reference"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FixedPop>
  );
};

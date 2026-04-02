"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { envConfig } from "@/config/envConfig";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import { ITestPanelFull, ITestRefData } from "@/types";
import { accessToken } from "@/services/AuthServices";
import FixedPop from "../fixedPop";

export const RefPanelCreateUpdateForm = ({
  handleModalClose,
  setReload,
  reload,
  defaultData, // 👈 NEW
}: {
  handleModalClose: () => void;
  setReload?: Dispatch<SetStateAction<boolean>>;
  reload?: boolean;
  defaultData?: ITestPanelFull; // 👈 optional
}) => {
  const isEditMode = Boolean(defaultData?._id);

  const [testRefs, setTestRefs] = useState<ITestRefData[]>([]);
  const [selectedRefs, setSelectedRefs] = useState<ITestRefData[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<Partial<ITestPanelFull>>({
    refName: "",
    panelName: "",
    priority: 1,
    isPanel: true,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchValue, setSearchValue] = useState("");
  // ✅ Search
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
        });
    }, 300);
  };

  // ✅ Prefill when editing
  useEffect(() => {
    if (defaultData) {
      setFormData({
        refName: defaultData.refName,
        panelName: defaultData.panelName,
        priority: defaultData.priority,
        isPanel: defaultData.isPanel,
      });

      setSelectedRefs(defaultData.tests || []);
    }
  }, [defaultData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  // ✅ Submit (Create + Update)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const acc = await accessToken();

    const testIds = selectedRefs.map((item) => item._id);

    const payload = {
      ...formData,
      tests: testIds,
    };
    console.log(payload);

    try {
      const res = await fetch(
        isEditMode
          ? `${envConfig.baseApi}/panel-reference/update/${defaultData?._id}`
          : `${envConfig.baseApi}/panel-reference`,
        {
          method: isEditMode ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${acc}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (data?.success) {
        toast.success(data.message);

        handleModalClose();

        if (setReload) {
          setReload(!reload);
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <FixedPop>
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {isEditMode ? "Update Test Panel" : "Create Test Panel"}
            </h2>
            <p className="text-sm text-teal-100">
              Manage laboratory test panel references
            </p>
          </div>

          <button
            onClick={handleModalClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Panel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Panel Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="panelName"
              value={formData.panelName}
              onChange={handleChange}
              placeholder="e.g. Complete Blood Count"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Reference Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="refName"
              value={formData.refName}
              onChange={handleChange}
              placeholder="e.g. LIPID_PROFILE"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Test Reference
            </label>

            <div className="flex items-center border border-gray-300 rounded-lg px-2">
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  handleRefSearch(e);
                }}
                placeholder="Search by test name..."
                className="w-full py-2 px-2 outline-none"
              />
              <Search size={18} className="text-gray-400" />
            </div>

            {/* Dropdown */}
            {testRefs.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {testRefs.map((ref) => (
                  <div
                    key={ref._id}
                    onClick={() => {
                      if (!selectedRefs.some((i) => i._id === ref._id)) {
                        setSelectedRefs((prev) => [...prev, ref]);
                      }

                      setTestRefs([]);

                      // ✅ clear input
                      setSearchValue("");

                      // ✅ focus again (after DOM update)
                      setTimeout(() => {
                        inputRef.current?.focus();
                      }, 0);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {ref.testName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ref.refName} • {ref.unit}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Tests
            </label>

            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {selectedRefs.length === 0 ? (
                <p className="text-sm text-gray-400 p-3">No test selected</p>
              ) : (
                selectedRefs.map((ref, index) => (
                  <div
                    key={ref._id}
                    className="flex justify-between items-center px-3 py-2 border-b last:border-none hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {index + 1}. {ref.testName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ref.refName} • {ref.referenceRange}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRefs((prev) =>
                          prev.filter((i) => i._id !== ref._id),
                        )
                      }
                      className="p-1 rounded hover:bg-red-100 text-red-500 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              min={1}
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleModalClose()}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              {isEditMode ? "Update Panel" : "Create Panel"}
            </button>
          </div>
        </form>
      </div>
    </FixedPop>
  );
};

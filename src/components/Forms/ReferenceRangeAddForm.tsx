"use client";

import { useState } from "react";
import { envConfig } from "@/config/envConfig";
import { toast } from "sonner";

interface ITestRef {
  refName: string;
  testName: string;
  unit: string;
  referenceRange: string;
  priority?: number;
}

export default function TestRefForm() {
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
          }
          //     setIsOpen(false);
          //     if (setNewPatient) {
          //       setNewPatient(data?.data);
          //     }
          //   }
          //   setSaving(false);
          //   if (setReload) {
          //     setReload(!reload);
          //   }
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
    <div className="max-w-lg mx-auto p-4 border rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">Create Test Reference</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="refName"
          placeholder="Reference Name"
          value={formData.refName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="testName"
          placeholder="Test Name"
          value={formData.testName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="unit"
          placeholder="Unit"
          value={formData.unit}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="referenceRange"
          placeholder="Reference Range"
          value={formData.referenceRange}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="number"
          name="priority"
          placeholder="Priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}

"use client";
import TiptapEditor from "@/components/TextEditor";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const dept = ["Haematology", "Biochemistry", "Serology"];

export default function UltrasonographyReportPage() {
  const [billNumber, setBillNumber] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState<string>("Haematology");

  const cont = `<p><em>Hi,</em></p><p><em>This is </em>the test Text</p><p><strong>I Hope you Understand</strong></p><p></p>`;
  const { control, handleSubmit } = useForm({
    defaultValues: {
      Details: cont,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data); // all form values
    toast.success(`${data.Details}`);
  };

  return (
    <div className="max-w-400 mx-auto p-2 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-2 mb-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-2 gap-4 border border-purple-400 rounded-lg p-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Bill / OP Number
              </label>
              <input
                type="number"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="w-full p-1 px-2 border border-gray-300 rounded-md text-lg"
                placeholder="e.g 26000001"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Service/Test Department
              </label>
              <select
                onChange={(e) => setDepartmentFilter(e.currentTarget.value)}
                className="w-full p-1.5 px-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dept.map((dep, idx) => (
                  <option key={idx} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-purple-400  p-3">
            <h3 className="font-semibold text-gray-800 mb-2 pb-2 border-b flex justify-between">
              <span>Patient Details</span>
              <span
              // className={`text-xs px-2 p-1 rounded ${
              //   currentBill?.status === "completed"
              //     ? "bg-green-100 text-green-800"
              //     : "bg-yellow-100 text-yellow-800"
              // }`}
              >
                {/* {currentBill?.status || "pending"} */}
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500">Patient Name</label>
                {/* <p className="font-medium">{currentBill?.patient.name}</p> */}
              </div>
              <div>
                <label className="text-xs text-gray-500">Age / Gender</label>
                <p className="font-medium">
                  {/* {/* {currentBill?.patient.age}y / {currentBill?.patient.gender} */}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <p className="font-medium">
                  {/* {currentBill?.patient.phone || "N/A"} */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----- */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="Details"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <div>
                <TiptapEditor content={field.value} onChange={field.onChange} />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />
        <div className="text-end pt-2">
          <button
            type="submit"
            className="inline-block p-2 px-8 bg-green-600 text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

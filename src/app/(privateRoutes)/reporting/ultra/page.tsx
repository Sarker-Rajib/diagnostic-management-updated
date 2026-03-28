"use client";
import TiptapEditor from "@/components/TextEditor";
import { envConfig } from "@/config/envConfig";
import { IUSGTemplate } from "@/types/usgReport";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ITestOrderPayload {
  patientInfo: {
    _id: string;
    fullName: string;
    gender: "Male" | "Female" | "Other";
    age: number;
    phoneNumber: string;
    pId: string;
  };
  services: [
    {
      serviceCode: number;
      serviceName: string;
      testName: string;
      price: number;
      panel: boolean;
      division: string;
      department: string;
      reportGroup: string;
      testSample: string;
      status: "pending" | "completed" | "cancelled"; // extend if needed
    },
  ];
}

export default function UltrasonographyReportPage() {
  const [data, setData] = useState<IUSGTemplate[]>();
  const [currentData, setCurrentData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [billNumber, setBillNumber] = useState<string>("");
  const [serviceBillData, setServiceBillData] =
    useState<ITestOrderPayload | null>(null);
  const [serviceTitle, setServiceTitle] = useState<string>();

  // load services
  useEffect(() => {
    const loadUsgServices = async () => {
      if (billNumber.length !== 8) {
        setCurrentData("");
        setServiceBillData(null);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `${envConfig.baseApi}/usg-report/list/B${billNumber}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          toast.error("Something went wrong");
        }

        const result = await response.json();

        setServiceBillData(result.data);
        setServiceTitle(result.data.services[0].serviceName);
        toast.success("Template Data Loaded successfully!");
      } catch (error) {
        console.error("Error fetching templates:", error);
        // throw error;
      } finally {
        setLoading(false);
      }
    };

    loadUsgServices();
  }, [billNumber]);

  // load templates
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${envConfig.baseApi}/usg-template/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          toast.error("Something went wrong");
        }

        const result = await response.json();

        setData(result.data.templates);
        toast.success("Template Data Loaded successfully!");
      } catch (error) {
        console.error("Error fetching templates:", error);
        // throw error;
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // ----------------------------------------
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      Details: "",
    },
  });

  useEffect(() => {
    reset({ Details: currentData || "" });
  }, [currentData, reset]);
  // ----------------------------------------

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
                onChange={(e) => {
                  setBillNumber(e.target.value);
                }}
                className="w-full p-1 px-2 border border-gray-300 rounded-md text-lg"
                placeholder="e.g 26000001"
                autoFocus
              />
            </div>
            {serviceBillData && serviceBillData.services.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Service/Test Department
                </label>
                <select
                  onChange={(e) => setServiceTitle(e.currentTarget.value)}
                  className="w-full p-1.5 px-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {serviceBillData.services?.map((dep, idx) => (
                    <option key={idx} value={dep.serviceName}>
                      {dep.serviceName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-red-600">
                {!billNumber
                  ? "Please input a bill number"
                  : serviceBillData == null
                    ? ""
                    : "No data Found"}
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-purple-400  p-3">
            <h3 className="font-semibold text-gray-800 mb-2 pb-2 border-b flex justify-between">
              <span>Patient Details</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500">Patient Name</label>
                <p className="font-medium">
                  {serviceBillData?.patientInfo.fullName}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Age / Gender</label>
                <p className="font-medium">
                  {serviceBillData?.patientInfo.age}y /{" "}
                  {serviceBillData?.patientInfo.gender}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <p className="font-medium">
                  {serviceBillData?.patientInfo.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----- */}
      <div className="report">
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg">
          <label className="whitespace-nowrap p-1 ps-2">
            Choose a Template :
          </label>
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-sky-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <select
              className="p-1 px-2 border border-gray-300 rounded-md text-lg"
              onChange={(e) => {
                const selected = data?.find(
                  (item) => item.title === e.currentTarget.value,
                );
                setCurrentData(selected?.template || "");
              }}
            >
              <option value="">Select Template</option>
              {data?.map((item, i) => (
                <option key={i} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="Details"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <div>
                  <TiptapEditor
                    content={field.value}
                    onChange={field.onChange}
                  />
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
    </div>
  );
}
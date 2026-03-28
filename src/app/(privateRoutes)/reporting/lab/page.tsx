// components/BloodReportSystem.tsx
"use client";

import PendingBills from "@/components/BillingItems/PendingBills";
import LabTable from "@/components/LabReport/LabTable";
import FloatingLoader from "@/components/Loader/FloatingLoader";
import { envConfig } from "@/config/envConfig";
import { ITestPanelFull, ITestRefData } from "@/types";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

interface IReportData {
  patientInfo: {
    _id: string;
    fullName: string;
    gender: string;
    age: number;
    phoneNumber: string;
    pId: string;
  };
  reportGroups: string[];
}

// Union Type (can be either single test or panel)
export type ILabService = ITestRefData | ITestPanelFull;

const BloodReportSystem: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [billInformation, setBillInformation] = useState<IReportData | null>(
    null,
  );
  const [testInformation, setTestInformation] = useState<ILabService[] | null>(
    null,
  );
  // data fetching filter
  const [billNumber, setBillNumber] = useState("");
  const [reportGroupFiler, setReportGroupFilter] = useState<string>();
  // -------------------------
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Fetch bill data when bill number changes
  useEffect(() => {
    if (billNumber.length == 8) {
      fetchBillData(billNumber);
    } else {
      setBillInformation(null);
      setTestInformation(null);
    }
  }, [billNumber]);

  useEffect(() => {
    if (reportGroupFiler) {
      fetchReportingData(billNumber, reportGroupFiler);
    }
  }, [reportGroupFiler]);

  const fetchBillData = async (billNo: string) => {
    setLoading(true);
    setLoadingMessage("Fetching patient records...");
    setLoadingProgress(0);

    try {
      const response = await fetch(
        `${envConfig.baseApi}/lab-report/report-groups/B${billNo}`,
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
      setReportGroupFilter(result.data.reportGroups[0]);
      setBillInformation(result.data);

      toast.success(result?.message);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportingData = async (billNo: string, reportGroup: string) => {
    setLoading(true);
    setLoadingMessage("Fetching patient records...");
    setLoadingProgress(0);

    try {
      const response = await fetch(
        `${envConfig.baseApi}/lab-report/group-tests/B${billNo}?reportGroup=${reportGroup}`,
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

      setTestInformation(result.data);

      toast.success(result?.message);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-400 mx-auto p-2">
      {/* Bill Search */}
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
            {billInformation ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Service/Test Department
                </label>

                <select
                  onChange={(e) => setReportGroupFilter(e.currentTarget.value)}
                  className="w-full p-1.5 px-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {billInformation?.reportGroups?.map((group, i) => (
                    <option key={i} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            ) : billNumber.length === 0 ? (
              <p className="text-rose-600 text-sm">
                Please input a bill Number
              </p>
            ) : billNumber.length !== 8 ? (
              <p className="text-rose-600 text-sm">
                Input Number must be 8 digits
              </p>
            ) : null}
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-purple-400  p-3">
            <h3 className="font-semibold text-gray-800 mb-2 pb-2 border-b flex justify-between">
              <span>Patient Details</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500">Patient Name</label>
                <p className="font-medium">
                  {billInformation?.patientInfo.fullName}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Age / Gender</label>
                <p className="font-medium">
                  {billInformation?.patientInfo.age}y /{" "}
                  {billInformation?.patientInfo.gender}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <p className="font-medium">
                  {billInformation?.patientInfo.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* loader */}
      {loading && (
        <FloatingLoader
          isLoading={loading}
          type="fullscreen"
          message={loadingMessage}
          progress={loadingProgress}
        />
      )}

      <div className="bg-white grid grid-cols-6 gap-4 p-2">
        {/* pending service id */}
        <div className="rounded-lg shadow-lg border border-purple-400 p-3">
          <PendingBills
            setBillNumber={setBillNumber}
            division="Laboratory Services"
          />
        </div>

        <div className="col-span-5 border border-purple-400 rounded-lg p-3 shadow-lg">
          {testInformation ? (
            <div>
              {testInformation.length > 0 ? (
                <div className="col-span-5">
                  <LabTable data={testInformation} />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                  <p className="text-gray-500">No tests available</p>
                </div>
              )}
            </div>
          ) : (
            billNumber &&
            !loading && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No bill found with number: {billNumber}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Please check the bill number and try again
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BloodReportSystem;

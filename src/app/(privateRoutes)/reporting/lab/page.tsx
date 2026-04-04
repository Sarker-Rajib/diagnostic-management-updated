// components/BloodReportSystem.tsx
"use client";

import PendingBills from "@/components/BillingItems/PendingBills";
import LabTable from "@/components/LabReport/LabTable";
import LabReportPrint from "@/components/ReportPad/LabReportFormat";
import { envConfig } from "@/config/envConfig";
import { ITestPanelFull, ITestRefData, TResultMap } from "@/types";
import { FPrint } from "@/utility/printComponent";
import React, { useState, useEffect, useRef } from "react";
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
  const [billNumber, setBillNumber] = useState<string>("");
  const [reportGroupFiler, setReportGroupFilter] = useState<string>("");
  // -------------------------

  // ------------------------
  const [results, setResults] = useState<TResultMap>({});

  // Fetch bill data when bill number changes
  useEffect(() => {
    if (billNumber.length == 8) {
      fetchBillData(billNumber);
    } else {
      setBillInformation(null);
      setTestInformation(null);
      setResults({});
    }
  }, [billNumber]);

  useEffect(() => {
    if (reportGroupFiler && reportGroupFiler !== "") {
      fetchReportingData(billNumber, reportGroupFiler);
    }
  }, [reportGroupFiler]);

  const fetchBillData = async (billNo: string) => {
    setLoading(true);
    // -----------------
    setTestInformation(null);
    setReportGroupFilter("");
    setResults({});
    // ----------------------------------

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
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportingData = async (billNo: string, reportGroup: string) => {
    setLoading(true);

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

  // print oftions state
  const printRef = useRef<HTMLDivElement>(null);
  const [shouldPrint, setShouldPrint] = useState<boolean>(false);

  useEffect(() => {
    if (testInformation && billInformation && shouldPrint) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [testInformation, shouldPrint]);

  const handlePrint = () => {
    if (printRef.current) {
      FPrint(printRef.current);
    }
  };
  // -----------------------------------------------------

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
          <div className="bg-white rounded-lg shadow-lg border border-purple-400 p-3">
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
              {testInformation?.length > 0 ? (
                <div className="col-span-5">
                  <LabTable
                    data={testInformation}
                    results={results}
                    setResults={setResults}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                  <p className="text-gray-500">No tests available</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  disabled={!testInformation || !billInformation || !results}
                  onClick={() => setShouldPrint(true)}
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 
                  hover:from-blue-700 hover:to-blue-800 
                  text-white font-medium rounded-lg 
                  shadow-md hover:shadow-lg 
                  transform hover:-translate-y-0.5 
                  transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print Report
                </button>
              </div>
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

          {loading && (
            <span className="flex items-center">
              <span className="me-2">Loading</span>
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
            </span>
          )}
        </div>
      </div>

      {/* printing portion */}
      <div className="hidden">
        {results && (
          <div>
            <div ref={printRef}>
              <LabReportPrint
                serviceTitle={reportGroupFiler}
                testList={testInformation}
                testResults={results}
                patientInfo={billInformation?.patientInfo}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodReportSystem;

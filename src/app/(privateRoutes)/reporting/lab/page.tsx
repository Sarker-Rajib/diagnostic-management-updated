// components/BloodReportSystem.tsx
"use client";

import FloatingLoader from "@/components/Loader/FloatingLoader";
import { envConfig } from "@/config/envConfig";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
export type DepartmentType = "Haematology" | "Biochemistry" | "Serology";
export type ReportStatus = "pending" | "completed" | "verified";

interface IPatientInfo {
  _id: string;
  fullName: string;
  gender: "Male" | "Female" | "Other"; // you can adjust if needed
  age: number;
  phoneNumber: string;
  pId: string;
}

interface IReportData {
  patientInfo: IPatientInfo;
  reportGroups: string[];
}

const BloodReportSystem: React.FC = () => {
  const [billNumber, setBillNumber] = useState("");
  const [billInformation, setBillInformation] = useState<IReportData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [departmentFilter, setDepartmentFilter] =
    useState<string>("Haematology");
  const dept = ["Haematology", "Biochemistry", "Serology"];

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  console.log(billInformation);

  // Fetch bill data when bill number changes
  useEffect(() => {
    if (billNumber.length == 8) {
      fetchBillData(billNumber);
    } else {
      setBillInformation(null);
    }
  }, [billNumber, departmentFilter]);

  const fetchBillData = async (billNo: string) => {
    setLoading(true);
    setLoadingMessage("Fetching patient records...");
    setLoadingProgress(0);

    try {
      const response = await fetch(
        `${envConfig.baseApi}/lab-report/report-groups/B${billNumber}`,
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
      setBillInformation(result.data);

      toast.success(result?.message);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update test value
  // const updateTestValue = (testId: string, value: string) => {
  //   setTestResults(prev => prev.map(test => {
  //     if (test.id === testId) {
  //       const numValue = parseFloat(value)
  //       let flag: 'low' | 'normal' | 'high' = 'normal'

  //       if (!isNaN(numValue) && currentBill?.patient.gender) {
  //         const range = test.referenceRange[currentBill.patient.gender]
  //         if (numValue < range[0]) flag = 'low'
  //         else if (numValue > range[1]) flag = 'high'
  //       }

  //       return { ...test, value, flag }
  //     }
  //     return test
  //   }))
  // }

  // // Group tests by department
  // const testsByDepartment = testResults.reduce((acc, test) => {
  //   if (!acc[test.department]) {
  //     acc[test.department] = []
  //   }
  //   acc[test.department].push(test)
  //   return acc
  // }, {} as Record<DepartmentType, TestResult[]>)

  const penfdingBills = ["26000001"];

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Service/Test Department
              </label>
              <select
                onChange={(e) => setDepartmentFilter(e.currentTarget.value)}
                className="w-full p-1.5 px-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {billInformation &&
                  billInformation.reportGroups.map((group, i) => (
                    <option key={i}>{group}</option>
                  ))}
              </select>
            </div>
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
          <h3 className="font-semibold text-gray-800 mb-3  border-b">
            Pending Services
          </h3>

          {penfdingBills.map((billNo) => (
            <p
              onClick={() => setBillNumber(billNo)}
              key={billNo}
              className="mb-2 text-gray-600 cursor-pointer hover:bg-gray-100 rounded bg-amber-100 text-center"
            >
              {billNo}
            </p>
          ))}
        </div>

        {/* data input section */}
        {/* <div className="col-span-5 border border-purple-400 rounded-lg p-3 shadow-lg"> 
          {billInformation ? (
            <div>
              {filteredBills && filteredBills.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBills.map((test: any) => (
                        <tr
                          key={test.id}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-3 py-1">
                            <div>
                              <div className="font-medium text-gray-800">
                                {test.name}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-1 text-sm text-gray-600">
                            {test.unit}
                          </td>
                          <td className="px-3 py-1">
                            <input
                              type="number"
                              name={test.nameShort}
                              placeholder="0.00"
                              className="w-28 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </td>
                          <td className="px-3 py-1">
                            <span className="text-sm text-gray-600">
                              {test.referenceRange.male}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
                    <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                      Save Results
                    </button>
                  </div>
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
        </div> */}
      </div>
    </div>
  );
};

export default BloodReportSystem;

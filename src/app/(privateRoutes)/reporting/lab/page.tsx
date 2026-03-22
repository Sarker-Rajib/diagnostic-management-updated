// components/BloodReportSystem.tsx
"use client";

import FloatingLoader from "@/components/Loader/FloatingLoader";
import React, { useState, useEffect } from "react";
export type DepartmentType = "Haematology" | "Biochemistry" | "Serology";
export type ReportStatus = "pending" | "completed" | "verified";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female";
  phone?: string;
  referredBy?: string;
}

export interface TestDefinition {
  id: string;
  name: string;
  unit: string;
  nameShort: string;
  methodology: string;
  department: DepartmentType;
  price: number;
  referenceRange: {
    male: [number, number];
    female: [number, number];
  };
}

export interface TestResult extends TestDefinition {
  value: string;
  flag: "low" | "normal" | "high";
  department: DepartmentType;
}
export interface Bill {
  billNumber: string;
  patient: Patient;
  date: string;
  services: TestDefinition[];
  results?: TestResult[];
  status: ReportStatus;
  lastUpdated?: string;
}
export const mockBills: Bill[] = [
  {
    billNumber: "26213680",
    patient: {
      id: "P001",
      name: "Rahul Sharma",
      age: 45,
      gender: "male",
      phone: "9876543210",
      referredBy: "Dr. Patel",
    },
    date: "2024-01-15T10:30:00",
    services: [
      {
        id: "h1",
        name: "Hemoglobin (Hb)",
        nameShort: "Hb",
        department: "Haematology",
        unit: "g/dL",
        referenceRange: { male: [13.5, 17.5], female: [12.0, 16.0] },
        methodology: "Cyanmethemoglobin Method",
        price: 100,
      },
      {
        id: "h2",
        name: "Total White Blood Cell Count",
        nameShort: "WBC",
        department: "Haematology",
        unit: "x10³/µL",
        referenceRange: { male: [4.0, 11.0], female: [4.0, 11.0] },
        methodology: "Impedance Method",
        price: 150,
      },
      {
        id: "h3",
        name: "Red Blood Cell Count",
        nameShort: "RBC",
        department: "Haematology",
        unit: "x10⁶/µL",
        referenceRange: { male: [4.5, 5.9], female: [4.1, 5.1] },
        methodology: "Impedance Method",
        price: 120,
      },
      {
        id: "h4",
        name: "Hematocrit",
        nameShort: "HCT",
        department: "Haematology",
        unit: "%",
        referenceRange: { male: [41, 50], female: [36, 48] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h5",
        name: "Mean Corpuscular Volume",
        nameShort: "MCV",
        department: "Haematology",
        unit: "fL",
        referenceRange: { male: [80, 100], female: [80, 100] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h6",
        name: "Mean Corpuscular Hemoglobin",
        nameShort: "MCH",
        department: "Haematology",
        unit: "pg",
        referenceRange: { male: [27, 34], female: [27, 34] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h7",
        name: "Mean Corpuscular Hemoglobin Concentration",
        nameShort: "MCHC",
        department: "Haematology",
        unit: "g/dL",
        referenceRange: { male: [32, 36], female: [32, 36] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "b10",
        name: "HDL Cholesterol",
        nameShort: "HDL",
        department: "Biochemistry",
        unit: "mg/dL",
        referenceRange: { male: [40, 60], female: [50, 60] },
        methodology: "Direct Method",
        price: 200,
      },
      {
        id: "b11",
        name: "LDL Cholesterol",
        nameShort: "LDL",
        department: "Biochemistry",
        unit: "mg/dL",
        referenceRange: { male: [0, 100], female: [0, 100] },
        methodology: "Friedewald Calculation",
        price: 200,
      },
      {
        id: "b12",
        name: "VLDL Cholesterol",
        nameShort: "VLDL",
        department: "Biochemistry",
        unit: "mg/dL",
        referenceRange: { male: [0, 30], female: [0, 30] },
        methodology: "Calculated",
        price: 100,
      },
      {
        id: "b13",
        name: "SGOT (AST)",
        nameShort: "AST",
        department: "Biochemistry",
        unit: "U/L",
        referenceRange: { male: [10, 40], female: [10, 40] },
        methodology: "UV Kinetic Method",
        price: 180,
      },
    ],
    status: "pending",
  },
  {
    billNumber: "26213681",
    patient: {
      id: "P002",
      name: "Priya Singh",
      age: 32,
      gender: "female",
      phone: "9876543211",
      referredBy: "Dr. Gupta",
    },
    date: "2024-01-15T11:45:00",
    services: [
      {
        id: "h1",
        name: "Hemoglobin (Hb)",
        nameShort: "Hb",
        department: "Haematology",
        unit: "g/dL",
        referenceRange: { male: [13.5, 17.5], female: [12.0, 16.0] },
        methodology: "Cyanmethemoglobin Method",
        price: 100,
      },
      {
        id: "h2",
        name: "Total White Blood Cell Count",
        nameShort: "WBC",
        department: "Haematology",
        unit: "x10³/µL",
        referenceRange: { male: [4.0, 11.0], female: [4.0, 11.0] },
        methodology: "Impedance Method",
        price: 150,
      },
      {
        id: "h3",
        name: "Red Blood Cell Count",
        nameShort: "RBC",
        department: "Haematology",
        unit: "x10⁶/µL",
        referenceRange: { male: [4.5, 5.9], female: [4.1, 5.1] },
        methodology: "Impedance Method",
        price: 120,
      },
      {
        id: "h4",
        name: "Hematocrit",
        nameShort: "HCT",
        department: "Haematology",
        unit: "%",
        referenceRange: { male: [41, 50], female: [36, 48] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h5",
        name: "Mean Corpuscular Volume",
        nameShort: "MCV",
        department: "Haematology",
        unit: "fL",
        referenceRange: { male: [80, 100], female: [80, 100] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h6",
        name: "Mean Corpuscular Hemoglobin",
        nameShort: "MCH",
        department: "Haematology",
        unit: "pg",
        referenceRange: { male: [27, 34], female: [27, 34] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h7",
        name: "Mean Corpuscular Hemoglobin Concentration",
        nameShort: "MCHC",
        department: "Haematology",
        unit: "g/dL",
        referenceRange: { male: [32, 36], female: [32, 36] },
        methodology: "Calculated",
        price: 80,
      },

      {
        id: "b12",
        name: "VLDL Cholesterol",
        nameShort: "VLDL",
        department: "Biochemistry",
        unit: "mg/dL",
        referenceRange: { male: [0, 30], female: [0, 30] },
        methodology: "Calculated",
        price: 100,
      },
      {
        id: "b13",
        name: "SGOT (AST)",
        nameShort: "AST",
        department: "Biochemistry",
        unit: "U/L",
        referenceRange: { male: [10, 40], female: [10, 40] },
        methodology: "UV Kinetic Method",
        price: 180,
      },
    ],
    status: "pending",
  },
  {
    billNumber: "26213682",
    patient: {
      id: "P003",
      name: "Amit Kumar",
      age: 28,
      gender: "male",
      phone: "9876543212",
    },
    date: "2024-01-16T09:15:00",
    services: [
      {
        id: "h1",
        name: "Hemoglobin (Hb)",
        nameShort: "Hb",
        department: "Haematology",
        unit: "g/dL",
        referenceRange: { male: [13.5, 17.5], female: [12.0, 16.0] },
        methodology: "Cyanmethemoglobin Method",
        price: 100,
      },
      {
        id: "h2",
        name: "Total White Blood Cell Count",
        nameShort: "WBC",
        department: "Haematology",
        unit: "x10³/µL",
        referenceRange: { male: [4.0, 11.0], female: [4.0, 11.0] },
        methodology: "Impedance Method",
        price: 150,
      },
      {
        id: "h3",
        name: "Red Blood Cell Count",
        nameShort: "RBC",
        department: "Haematology",
        unit: "x10⁶/µL",
        referenceRange: { male: [4.5, 5.9], female: [4.1, 5.1] },
        methodology: "Impedance Method",
        price: 120,
      },
      {
        id: "h4",
        name: "Hematocrit",
        nameShort: "HCT",
        department: "Haematology",
        unit: "%",
        referenceRange: { male: [41, 50], female: [36, 48] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h5",
        name: "Mean Corpuscular Volume",
        nameShort: "MCV",
        department: "Haematology",
        unit: "fL",
        referenceRange: { male: [80, 100], female: [80, 100] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h6",
        name: "Mean Corpuscular Hemoglobin",
        nameShort: "MCH",
        department: "Haematology",
        unit: "pg",
        referenceRange: { male: [27, 34], female: [27, 34] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "h7",
        name: "Mean Corpuscular Hemoglobin Concentration",
        nameShort: "MCHC",
        department: "Haematology",
        unit: "g/dL",
        referenceRange: { male: [32, 36], female: [32, 36] },
        methodology: "Calculated",
        price: 80,
      },
      {
        id: "b10",
        name: "HDL Cholesterol",
        nameShort: "HDL",
        department: "Biochemistry",
        unit: "mg/dL",
        referenceRange: { male: [40, 60], female: [50, 60] },
        methodology: "Direct Method",
        price: 200,
      },
      {
        id: "b11",
        name: "LDL Cholesterol",
        nameShort: "LDL",
        department: "Biochemistry",
        unit: "mg/dL",
        referenceRange: { male: [0, 100], female: [0, 100] },
        methodology: "Friedewald Calculation",
        price: 200,
      },
      {
        id: "b12",
        name: "VLDL Cholesterol",
        nameShort: "VLDL",
        department: "Biochemistry",
        unit: "mg/dL",
        referenceRange: { male: [0, 30], female: [0, 30] },
        methodology: "Calculated",
        price: 100,
      },
    ],
    status: "completed",
    // results: [
    //   {
    //     id: 'b1',
    //     name: 'Blood Glucose (Fasting)',
    //     unit: 'mg/dL',
    //     referenceRange: { male: [70, 100], female: [70, 100] },
    //     value: '95',
    //     flag: 'normal',
    //     department: 'Biochemistry'
    //   },
    //   {
    //     id: 'b3',
    //     name: 'Creatinine',
    //     unit: 'mg/dL',
    //     referenceRange: { male: [0.7, 1.3], female: [0.6, 1.1] },
    //     value: '1.1',
    //     flag: 'normal',
    //     department: 'Biochemistry'
    //   }
    // ]
  },
  {
    billNumber: "26213683",
    patient: {
      id: "P002",
      name: "Amit Verma",
      age: 38,
      gender: "male",
      phone: "9123456780",
      referredBy: "Dr. Singh",
    },
    date: "2024-02-10T09:15:00",
    services: [
      {
        id: "m1",
        name: "Urine Culture",
        nameShort: "UC",
        department: "Serology",
        unit: "CFU/mL",
        referenceRange: { male: [0, 10000], female: [0, 10000] },
        methodology: "Culture Method",
        price: 300,
      },
    ],
    status: "completed",
  },
  {
    billNumber: "26213684",
    patient: {
      id: "P003",
      name: "Sneha Gupta",
      age: 29,
      gender: "female",
      phone: "9234567810",
      referredBy: "Dr. Mehta",
    },
    date: "2024-02-11T11:00:00",
    services: [
      {
        id: "i1",
        name: "TSH",
        nameShort: "TSH",
        department: "Biochemistry",
        unit: "µIU/mL",
        referenceRange: { male: [0.4, 4.0], female: [0.4, 4.0] },
        methodology: "CLIA",
        price: 250,
      },
    ],
    status: "pending",
  },
  {
    billNumber: "26213685",
    patient: {
      id: "P004",
      name: "Ravi Kumar",
      age: 50,
      gender: "male",
      phone: "9345678120",
      referredBy: "Dr. Shah",
    },
    date: "2024-02-12T14:20:00",
    services: [
      {
        id: "s1",
        name: "CRP",
        nameShort: "CRP",
        department: "Biochemistry",
        unit: "mg/L",
        referenceRange: { male: [0, 5], female: [0, 5] },
        methodology: "Turbidimetry",
        price: 220,
      },
    ],
    status: "completed",
  },
  {
    billNumber: "26213686",
    patient: {
      id: "P005",
      name: "Neha Joshi",
      age: 34,
      gender: "female",
      phone: "9456781230",
      referredBy: "Dr. Patel",
    },
    date: "2024-02-13T10:45:00",
    services: [
      {
        id: "se1",
        name: "Widal Test",
        nameShort: "Widal",
        department: "Serology",
        unit: "Titre",
        referenceRange: { male: [0, 1], female: [0, 1] },
        methodology: "Agglutination",
        price: 180,
      },
    ],
    status: "pending",
  },
  {
    billNumber: "26213687",
    patient: {
      id: "P006",
      name: "Karan Malhotra",
      age: 41,
      gender: "male",
      phone: "9567812340",
      referredBy: "Dr. Roy",
    },
    date: "2024-02-14T08:30:00",
    services: [
      {
        id: "p1",
        name: "Semen Analysis",
        nameShort: "SA",
        department: "Serology",
        unit: "million/mL",
        referenceRange: { male: [15, 200], female: [0, 0] },
        methodology: "Microscopy",
        price: 400,
      },
    ],
    status: "completed",
  },
  {
    billNumber: "26213688",
    patient: {
      id: "P007",
      name: "Priya Nair",
      age: 27,
      gender: "female",
      phone: "9678123450",
      referredBy: "Dr. Iyer",
    },
    date: "2024-02-15T13:10:00",
    services: [
      {
        id: "horm1",
        name: "Prolactin",
        nameShort: "PRL",
        department: "Serology",
        unit: "ng/mL",
        referenceRange: { male: [4, 15], female: [5, 25] },
        methodology: "ELISA",
        price: 300,
      },
    ],
    status: "pending",
  },
  {
    billNumber: "26213689",
    patient: {
      id: "P008",
      name: "Arjun Das",
      age: 60,
      gender: "male",
      phone: "9781234560",
      referredBy: "Dr. Banerjee",
    },
    date: "2024-02-16T09:50:00",
    services: [
      {
        id: "coag1",
        name: "Prothrombin Time",
        nameShort: "PT",
        department: "Serology",
        unit: "seconds",
        referenceRange: { male: [11, 13.5], female: [11, 13.5] },
        methodology: "Clotting Method",
        price: 200,
      },
    ],
    status: "completed",
  },
  {
    billNumber: "26213690",
    patient: {
      id: "P009",
      name: "Meera Kapoor",
      age: 31,
      gender: "female",
      phone: "9890123456",
      referredBy: "Dr. Khanna",
    },
    date: "2024-02-17T12:25:00",
    services: [
      {
        id: "vi1",
        name: "Hepatitis B Surface Antigen",
        nameShort: "HBsAg",
        department: "Serology",
        unit: "Index",
        referenceRange: { male: [0, 1], female: [0, 1] },
        methodology: "ELISA",
        price: 350,
      },
    ],
    status: "pending",
  },
  {
    billNumber: "26213691",
    patient: {
      id: "P010",
      name: "Vikram Singh",
      age: 48,
      gender: "male",
      phone: "9901234567",
      referredBy: "Dr. Yadav",
    },
    date: "2024-02-18T15:00:00",
    services: [
      {
        id: "toxic1",
        name: "Blood Alcohol Level",
        nameShort: "BAL",
        department: "Serology",
        unit: "mg/dL",
        referenceRange: { male: [0, 10], female: [0, 10] },
        methodology: "Enzymatic Method",
        price: 500,
      },
    ],
    status: "completed",
  },
  {
    billNumber: "26213692",
    patient: {
      id: "P011",
      name: "Anita Reddy",
      age: 36,
      gender: "female",
      phone: "9012345678",
      referredBy: "Dr. Reddy",
    },
    date: "2024-02-19T10:10:00",
    services: [
      {
        id: "cyto1",
        name: "Pap Smear",
        nameShort: "Pap",
        department: "Serology",
        unit: "Report",
        referenceRange: { male: [0, 0], female: [0, 1] },
        methodology: "Microscopy",
        price: 450,
      },
    ],
    status: "pending",
  },
];

const BloodReportSystem: React.FC = () => {
  const [billNumber, setBillNumber] = useState("");
  const [currentBill, setCurrentBill] = useState<Bill | null>(null);
  // const [testResults, setTestResults] = useState<any>()
  const [loading, setLoading] = useState(false);
  const [savedBills, setSavedBills] = useState<Bill[]>(mockBills);
  const [departmentFilter, setDepartmentFilter] =
    useState<string>("Haematology");
  const dept = ["Haematology", "Biochemistry", "Serology"];
  const [filteredBills, setFilteredBills] = useState<TestDefinition[]>([]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Fetch bill data when bill number changes
  useEffect(() => {
    if (billNumber.length == 8) {
      fetchBillData(billNumber);
    } else {
      setCurrentBill(null);
      // setTestResults([])
    }
  }, [billNumber, departmentFilter]);

  const fetchBillData = (billNo: string) => {
    setLoading(true);
    setLoadingMessage("Fetching patient records...");
    setLoadingProgress(0);

    // Simulate API call - replace with actual API call
    setTimeout(() => {
      const foundBill = savedBills.find((b) => b.billNumber === billNo);

      if (foundBill) {
        setCurrentBill(foundBill);
        // Initialize test results with empty values based on services
        // console.log(foundBill);
        const initializedTests = foundBill.services.filter(
          (service) => service.department == departmentFilter,
        );
        setFilteredBills(initializedTests);
        // setTestResults(initializedTests)
      } else {
        setCurrentBill(null);
        // setTestResults([])
      }
      setLoading(false);
    }, 100);
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

  const penfdingBills = [
    "26213682",
    "26213683",
    "26213684",
    "26213685",
    "26213686",
    "26213687",
    "26213688",
    "26213689",
  ];

  return (
    <div className="max-w-400 mx-auto p-2">
      {/* Bill Search */}
      <div className="bg-white rounded-lg shadow-lg p-2 mb-2">
        <div className="bg-white rounded-lg p-2 mb-1">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-sm font-medium text-gray-600">
              Recent Bills:
            </span>
            {savedBills.slice(0, 5).map((bill) => (
              <button
                key={bill.billNumber}
                onClick={() => setBillNumber(bill.billNumber)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
                ${
                  bill.status === "completed"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {bill.billNumber} - {bill.patient.name}
              </button>
            ))}
          </div>
        </div>
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
                className={`text-xs px-2 p-1 rounded ${
                  currentBill?.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentBill?.status || "pending"}
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500">Patient Name</label>
                <p className="font-medium">{currentBill?.patient.name}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Age / Gender</label>
                <p className="font-medium">
                  {currentBill?.patient.age}y / {currentBill?.patient.gender}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone</label>
                <p className="font-medium">
                  {currentBill?.patient.phone || "N/A"}
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
        <div className="col-span-5 border border-purple-400 rounded-lg p-3 shadow-lg">
          {/* Main Content - Only shown if bill found */}
          {currentBill ? (
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
        </div>
      </div>

      {/* Recent Bills */}
    </div>
  );
};

export default BloodReportSystem;

"use client";
import { envConfig } from "@/config/envConfig";
import { useEffect, useState } from "react";

type Props = {
  division: string;
  setBillNumber: (billNo: string) => void;
};

const PendingBills = ({ division, setBillNumber }: Props) => {
  const [pendingBills, setPendingBills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!division) return;

    const fetchBills = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${envConfig.baseApi}/bill/recent?division=${division}`,
        );

        const data = await res.json();
        const billIds = data?.data?.map((b: any) => b.billId) || [];

        setPendingBills(billIds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [division]);

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">
        Pending Services
      </h3>

      {loading ? (
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
      ) : pendingBills.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-2">
          No pending bills
        </p>
      ) : (
        pendingBills.map((billNo) => (
          <p
            key={billNo}
            onClick={() => setBillNumber(billNo.slice(1, 9))}
            className="mb-2 text-gray-700 cursor-pointer hover:bg-gray-100 rounded bg-amber-100 text-center py-1 transition"
          >
            {billNo}
          </p>
        ))
      )}
    </div>
  );
};

export default PendingBills;

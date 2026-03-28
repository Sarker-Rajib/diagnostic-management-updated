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

        console.log(data);

        // assuming API returns: [{ billId: "B26000001" }]
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
        <p>Loading</p>
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

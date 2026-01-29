"use client";

import { envConfig } from "@/config/envConfig";
import { IBill } from "@/types";
import { useEffect, useState } from "react";

export default function ExpancePage() {
  const [billCollection, setBillCollection] = useState<IBill[] | null>(null);

  useEffect(() => {
    const getData = async () => {
      fetch(`${envConfig.baseApi}/bill`)
        .then((res) => res.json())
        .then((data) => {
          setBillCollection(data?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getData();
  }, []);

  return (
    <div className="p-3">
      <div className="overflow-auto bg-white rounded-lg">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-white">
            <tr>
              <th className="border px-3 py-2">Bill ID</th>
              <th className="border px-3 py-2">Patient</th>
              <th className="border px-3 py-2">Phone</th>
              <th className="border px-3 py-2">Services</th>
              <th className="border px-3 py-2">Subtotal</th>
              <th className="border px-3 py-2">Discount</th>
              <th className="border px-3 py-2">Total</th>
              <th className="border px-3 py-2">Paid</th>
              <th className="border px-3 py-2">Due</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Method</th>
              <th className="border px-3 py-2">Billed By</th>
              <th className="border px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {billCollection &&
              billCollection.map((bill) => (
                <tr key={bill._id} className="text-center">
                  <td className="border px-3 py-2">{bill.billId}</td>
                  <td className="border px-3 py-2">
                    {bill.patientInfo.fullName}
                  </td>
                  <td className="border px-3 py-2">
                    {bill.patientInfo.phoneNumber}
                  </td>
                  <td className="border px-3 py-2 text-left">
                    {bill.services.map((s) => (
                      <div key={s._id}>
                        {s.serviceName} - ৳{s.price}
                      </div>
                    ))}
                  </td>
                  <td className="border px-3 py-2">৳{bill.subTotal}</td>
                  <td className="border px-3 py-2 text-red-600">
                    -৳{bill.discount}
                  </td>
                  <td className="border px-3 py-2">৳{bill.totalAmount}</td>
                  <td className="border px-3 py-2 text-green-600">
                    ৳{bill.paidAmount}
                  </td>
                  <td className="border px-3 py-2 text-red-600">
                    ৳{bill.dueAmount}
                  </td>
                  <td className="border px-3 py-2">{bill.paymentStatus}</td>
                  <td className="border px-3 py-2">{bill.paymentMethod}</td>
                  <td className="border px-3 py-2">{bill.billedBy.fullName}</td>
                  <td className="border px-3 py-2">
                    {new Date(bill.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { envConfig } from "@/config/envConfig";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { IInvoice, IPatient } from "@/types";
import { accessToken } from "@/services/AuthServices";
import { PropagateLoader } from "react-spinners";
import { format } from "date-fns";
import { Calendar, CreditCard, Pen, Phone, User } from "lucide-react";
import { FPrint } from "@/utility/printComponent";
import Invoice from "@/components/Invoice/Invoice";
import { UpdatePatientComponent } from "@/components/PatientComponents/UpdatePatient";

export default function PrescriptioPage() {
  const [reload, setReload] = useState<boolean>(false);
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const [patient, setPatient] = useState<IPatient | null>(null);
  //   const [prescriptions, setPrescriptions] = useState<IPrescription[]>();
  const [bills, setBills] = useState<IInvoice[] | null>(null);

  const [toUpdatePatient, setToUpdatePatient] = useState<IPatient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`${envConfig.baseApi}/patient/${id}`);
        const data = await response.json();
        const patientData = data.data[0];
        setPatient(patientData);

        const token = await accessToken();

        // const prescriptionResponse = await fetch(
        //   `${envConfig.baseApi}/prescription/patient/${patientData.pId}`,
        //   {
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `${token}`,
        //     },
        //   }
        // );

        // const prescriptionsData = await prescriptionResponse.json();
        // setPrescriptions(prescriptionsData.data);

        // bills
        const billResponse = await fetch(
          `${envConfig.baseApi}/bill/all/${patientData._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        const billsData = await billResponse.json();
        if (billsData.success) {
          toast.success("data found successfully");
          setBills(billsData.data);
        } else {
          toast.error(`${billsData.message} for Bills`);
          setBills([]);
        }
      } catch (error) {
        console.log("Error fetching patient data:", error);
        toast.error("Error fetching patient data");
      }
    };

    fetchPatient();
  }, [id, reload]);

  const [shouldPrint, setShouldPrint] = useState<boolean>(false);
  const [toPrintBill, setToPrintBill] = useState<IInvoice | null>(null);
  useEffect(() => {
    if (toPrintBill && shouldPrint) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [toPrintBill, shouldPrint]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      FPrint(printRef.current);
    }
  };

  const handleBillPrint = () => {
    setShouldPrint(true);
  };

  return (
    <div className="p-4">
      {/* Pt display data */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            Patient History
          </h1>
        </div>

        {/* Patient Information Card */}
        <div className="p-6">
          {patient ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden mb-6">
              {/* Patient Details */}
              <div className="grid md:grid-cols-3 gap-6 p-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-full">
                      <User size={24} className="text-teal-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Patient Details
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">
                        Patient ID
                      </span>
                      <span className="text-gray-800">{patient.pId}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Name</span>
                      <span className="text-gray-800">{patient.fullName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Gender</span>
                      <span className="text-gray-800">{patient.gender}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Age</span>
                      <span className="text-gray-800">{patient.age} Yrs</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Phone size={24} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Contact Information
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Phone</span>
                      <a
                        href={`tel:${patient.phoneNumber}`}
                        className="text-blue-600 hover:underline"
                      >
                        {patient.phoneNumber}
                      </a>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Email</span>
                      {patient.email ? (
                        <a
                          href={`mailto:${patient.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {patient.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Address</span>
                      <span
                        className="text-gray-800 max-w-[150px] truncate"
                        title={patient.address}
                      >
                        {patient.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Record Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar size={24} className="text-gray-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Record Information
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Created</span>
                      <span className="text-gray-800">
                        {format(new Date(patient.createdAt), "dd-MM-yyyy")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-600">Updated</span>
                      <span className="text-gray-800">
                        {format(new Date(patient.updatedAt), "dd-MM-yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-end gap-4">
                {/* <Link
                  href={`/prescriptions/create/${patient?._id}`}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <FilePlus size={18} />
                  Create Prescription
                </Link> */}
                <button
                  onClick={() => setToUpdatePatient(patient)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <Pen size={18} />
                  Edit Patient
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 flex justify-center">
              <PropagateLoader color="#0d9488" />
            </div>
          )}

          {/* Prescriptions Section */}
          {/* <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden mb-6">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ClipboardList size={20} className="text-teal-600" />
                Prescriptions List
              </h2>
            </div>

            {prescriptions ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prescription ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prescriptions?.map((prescription) => (
                      <tr key={prescription._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {prescription.prescriptionId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {prescription.doctorId.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(
                            new Date(prescription.createdAt),
                            "dd-MM-yyyy"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/prescriptions/${prescription._id}`}
                            className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-md transition-colors"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 flex justify-center">
                <PropagateLoader color="#0d9488" />
              </div>
            )}
          </div> */}

          {/* Bills Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CreditCard size={20} className="text-teal-600" />
                Bill List
              </h2>
            </div>

            {bills == null ? (
              <div className="py-12 flex justify-center">
                <PropagateLoader color="#0d9488" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bill ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Billed By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bills?.map((bill) => (
                      <tr key={bill._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bill.billId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bill.billedBy?.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(bill.createdAt), "dd-MM-yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                          {bill.totalAmount.toFixed(2)}/=
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setToPrintBill(bill);
                              handleBillPrint();
                            }}
                            className="text-teal-600 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* upadate patient modal */}
      {toUpdatePatient && (
        <UpdatePatientComponent
          setToUpdatePatient={setToUpdatePatient}
          setReload={setReload}
          reload={reload}
          toUpdatePatient={toUpdatePatient}
        />
      )}

      <div className="hidden">
        <div>
          <div ref={printRef}>
            {toPrintBill && <Invoice invoice={toPrintBill} />}
          </div>
        </div>
      </div>
    </div>
  );
}

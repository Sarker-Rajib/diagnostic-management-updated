"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Pencil,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { envConfig } from "@/config/envConfig";
import Link from "next/link";
import { PropagateLoader } from "react-spinners";
import { IPatient } from "@/types";
import { UpdatePatientComponent } from "@/components/PatientComponents/UpdatePatient";
import { CreatePatientComponent } from "@/components/PatientComponents/CreatePatient";
import { IMeta } from "@/interfaces";

export default function PatientsPage() {
  const [reload, setReload] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const [oldPatients, setOldPatients] = useState<IPatient[] | null>(null);
  // update states
  const [toUpdatePatient, setToUpdatePatient] = useState<IPatient | null>(null);
  const [meta, setMeta] = useState<IMeta | null>(null);

  //  /// // //
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Build URL conditionally
      let url = `${envConfig.baseApi}/patient/all`;

      if (searchText.trim()) {
        // Searching → no pagination params
        url += `?search=${encodeURIComponent(searchText)}`;
      } else {
        // No search → include pagination
        url += `?page=${page}&limit=${limit}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setOldPatients(data?.data?.patientData);
          setMeta(data?.data?.meta);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText, reload, page, limit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
          <div className="flex items-center gap-3 bg-teal-700 px-6 py-3 rounded-lg shadow-md">
            <Users size={26} className="text-white" />
            <h1 className="text-xl font-bold text-white">
              Patients Management
            </h1>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <span className="text-lg font-semibold">Register Patient</span>
            <Pencil size={20} className="text-white" />
          </button>
        </div>

        {/* Patients List Card */}
        <div className="bg-white rounded-xl">
          {/* List Header */}
          <div className="sticky top-1">
            <div className="bg-teal-600 rounded-t-xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 ">
              <h2 className="text-xl font-semibold text-white">
                Patients List{" "}
                {meta && (
                  <span className="text-sm">( Total : {meta.total} )</span>
                )}
              </h2>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Search Box */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="text-gray-700 w-full pl-4 pr-10 py-2 rounded-lg border placeholder:text-amber-100 focus:ring-2 focus:ring-teal-300"
                  />
                  <Search
                    size={20}
                    className="absolute right-3 top-2.5 text-teal-600"
                  />
                </div>

                {/* Pagination Controls */}
                <div className="flex gap-1">
                  {/* Show pagination only when NOT searching and meta exists */}
                  {!searchText.trim() && meta && (
                    <>
                      {/* Previous Button */}
                      <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        title="Previous Page"
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} className="text-white" />
                      </button>

                      {/* Page Info */}
                      <span className="p-2 bg-green-600/70 text-white rounded-lg transition">
                        {meta.page} / {meta.totalPages}
                      </span>

                      {/* Next Button */}
                      <button
                        disabled={page === meta.totalPages}
                        onClick={() =>
                          setPage((prev) => Math.min(prev + 1, meta.totalPages))
                        }
                        title="Next Page"
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} className="text-white" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Patients Table */}
            {oldPatients?.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Users size={40} className="text-teal-600" />
                </div>
                <p className="text-xl font-medium text-gray-600">
                  No patients found
                </p>
                <button
                  onClick={() => setIsOpen(true)}
                  className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Register New Patient
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-slate-500">
                    {oldPatients?.map((patient) => (
                      <tr
                        key={patient.pId}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/dashboard/patients/${patient._id}`}
                            className="text-teal-600 hover:text-teal-800 font-medium"
                          >
                            {patient?.pId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/dashboard/patients/${patient._id}`}
                            className="text-teal-600 hover:text-teal-800"
                          >
                            {patient?.fullName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              patient?.gender === "Male"
                                ? "bg-blue-100 text-blue-800"
                                : patient?.gender === "Female"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-purple-100 text-gray-800"
                            }`}
                          >
                            {patient?.gender}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patient?.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`tel:${patient?.phoneNumber}`}
                            className="hover:text-teal-600"
                          >
                            {patient?.phoneNumber}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patient?.email && (
                            <a
                              href={`mailto:${patient?.email}`}
                              className="hover:text-teal-600"
                            >
                              {patient?.email}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setToUpdatePatient(patient)}
                              title="Update data"
                              className="p-2 bg-teal-100 hover:bg-teal-200 rounded-lg text-teal-600 transition cursor-pointer"
                            >
                              <Pencil size={18} />
                            </button>
                            <Link
                              href={`/dashboard/patients/${patient._id}`}
                              title="View details"
                              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600 transition"
                            >
                              <Eye size={18} />
                            </Link>
                            {/* <Link
                              href={`/prescriptions/create/${patient._id}`}
                              title="Create New Prescription"
                              className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-gray-600 transition"
                            >
                              <FilePlus size={18} />
                            </Link> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {oldPatients === null && (
              <div className="py-12 flex justify-center">
                <div className="text-center">
                  <PropagateLoader color="#0d9488" />
                  <p className="mt-4 text-gray-600">Loading patients...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Patient Modal */}
        {isOpen && (
          <CreatePatientComponent
            setIsOpen={setIsOpen}
            setReload={setReload}
            reload={reload}
          />
        )}

        {/* Update Patient Modal */}
        {toUpdatePatient && (
          <UpdatePatientComponent
            setToUpdatePatient={setToUpdatePatient}
            setReload={setReload}
            reload={reload}
            toUpdatePatient={toUpdatePatient}
          />
        )}
      </div>
    </div>
  );
}

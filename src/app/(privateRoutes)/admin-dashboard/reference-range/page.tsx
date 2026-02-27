"use client";
import { TestRefCraeteForm } from "@/components/Forms/ReferenceRangeAddForm";
import { envConfig } from "@/config/envConfig";
import { IMeta, ITestRefData } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Eraser,
  Pencil,
  Scale,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

export default function RefRangePage() {
  const [reload, setReload] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  // all refs
  const [allTestRefs, setAllTestRefs] = useState<ITestRefData[] | null>(null);
  const [meta, setMeta] = useState<IMeta | null>(null);

  //  /// // //
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Build URL conditionally
      let url = `${envConfig.baseApi}/reference-value/all`;

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
          setAllTestRefs(data?.data?.testRefData);
          setMeta(data?.data?.meta);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText, reload, page, limit]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
        <div className="flex items-center gap-3 bg-teal-700 px-6 py-3 rounded-lg shadow-md">
          <Scale size={26} className="text-white" />
          <h1 className="text-xl font-bold text-white">
            Reference range Management
          </h1>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <span className="text-lg font-semibold">Register Reference </span>
          <Pencil size={20} className="text-white" />
        </button>
      </div>

      {/* ref List Card */}
      <div className="bg-teal-400 rounded-xl">
        {/* List Header */}
        <div className="sticky top-1">
          <div className="bg-teal-600 rounded-t-xl px-4 py-1.5 flex flex-col sm:flex-row justify-between items-center gap-4 ">
            <h2 className="text-xl font-semibold text-white">
              Patients List{" "}
              {meta && (
                <span className="text-sm">( Total : {meta.total} )</span>
              )}
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative grow sm:grow-0 sm:w-64">
                <input
                  type="text"
                  placeholder="Search refs..."
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
          {allTestRefs?.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Users size={40} className="text-teal-600" />
              </div>
              <p className="text-xl font-medium text-gray-600">No refs found</p>
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
                      Test Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ref Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Normal Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-slate-500">
                  {allTestRefs?.map((ref, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-2 py-1 whitespace-nowrap">
                        <Link
                          href={`/admin-dashboard/reference-range/${ref._id}`}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          {ref?.testName}
                        </Link>
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        {ref?.refName}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        {ref?.unit}
                      </td>
                      <td className="px-2 py-1 whitespace-pre-line">
                        {ref?.referenceRange}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin-dashboard/reference-range/${ref._id}`}
                            title="Update data"
                            className="p-2 bg-teal-100 hover:bg-teal-200 rounded-lg text-teal-600 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            title="Delete"
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600 transition"
                          >
                            <Eraser size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {allTestRefs === null && (
            <div className="py-12 flex justify-center">
              <div className="text-center">
                <PropagateLoader color="#0d9488" />
                <p className="mt-4 text-gray-600">
                  Loading reference ranges...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {isOpen && (
        <TestRefCraeteForm
          setIsOpen={setIsOpen}
          setReload={setReload}
          reload={reload}
        />
      )}
    </div>
  );
}

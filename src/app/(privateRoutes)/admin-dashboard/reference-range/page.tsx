"use client";
import FixedPop from "@/components/fixedPop";
import { TestRefForm } from "@/components/Forms/ReferenceRangeHandleForm";
import { envConfig } from "@/config/envConfig";
import { IMeta, ITestRefData } from "@/types";
import {
  ArrowRight,
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
import { toast } from "sonner";

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

  // update states
  const [toUpdateRef, setToUpdateRef] = useState<ITestRefData | null>(null);

  // close func
  const handleClose = () => {
    setIsOpen(false);
    setToUpdateRef(null);
  };

  // delete states
  const [toDeleteRef, setToDeleteRef] = useState<ITestRefData | null>(null);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${envConfig.baseApi}/reference-value/delete/${toDeleteRef?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // Add any auth headers if needed
            // 'Authorization': `Bearer ${yourToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete: ${response.status}`,
        );
      }

      const data = await response.json();

      toast.success(data?.message);
    } catch (error) {
      console.error("Error deleting panel reference:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    } finally {
      setToDeleteRef(null);
      setReload(!reload);
    }
  };

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
      <div className="flex justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 bg-teal-700 px-6 py-3 rounded-lg shadow-md">
            <Scale size={26} className="text-white" />
            <h1 className="text-xl font-bold text-white">
              Reference range Management
            </h1>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex border border-yellow-400 items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <span className="text-lg font-semibold">Register Reference </span>
            <Pencil size={20} className="text-white" />
          </button>
        </div>

        <div className="text-end mb-2">
          <Link
            href={`/admin-dashboard/reference-range/panel-reference`}
            className="border border-yellow-400 text-lg hover:bg-teal-700 bg-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center text-amber-600"
          >
            Panel Reference
            <ArrowRight size={18} className="ms-2/s" />
          </Link>
        </div>
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

        <div className="p-1">
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
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-slate-500">
                  {allTestRefs?.map((ref, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="px-2 py-1 text-center whitespace-nowrap">
                        {i + 1}
                      </td>
                      <td className="ps-2 p-1 whitespace-nowrap">
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
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setToUpdateRef(ref)}
                            title="Update data"
                            className="p-2 bg-teal-100 hover:bg-teal-200 rounded-lg text-teal-600 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => setToDeleteRef(ref)}
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
        <TestRefForm
          mode="create"
          handleClose={handleClose}
          setReload={setReload}
          reload={reload}
        />
      )}

      {/* update item */}
      {toUpdateRef && (
        <TestRefForm
          mode="update"
          id={toUpdateRef._id}
          initialData={toUpdateRef}
          handleClose={handleClose}
          setReload={setReload}
          reload={reload}
        />
      )}

      {/* confirm delete modal */}
      {toDeleteRef && (
        <FixedPop>
          <div className="text-center bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Do You want to delete the pannel?
            </h3>

            <hr />
            <br />

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setToDeleteRef(null)}
                className="px-4 py-2 text-sky-600 hover:text-gray-900 bg-amber-300 rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </FixedPop>
      )}
    </div>
  );
}

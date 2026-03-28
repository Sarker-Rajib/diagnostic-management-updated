"use client";
import FixedPop from "@/components/fixedPop";
import { RefPanelCraeteForm } from "@/components/Forms/ReferencePanelAddForm";
import { envConfig } from "@/config/envConfig";
import { IMeta, ITestPanelFull } from "@/types";
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
import { toast } from "sonner";

export default function RefRangePage() {
  const [reload, setReload] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  // all refs
  const [allTestPanels, setAllTestPanels] = useState<ITestPanelFull[] | null>(
    null,
  );
  const [meta, setMeta] = useState<IMeta | null>(null);
  // ////
  const [deletePannelId, setDeletePanelId] = useState<string | null>(null);

  //  /// // //
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Build URL conditionally
      let url = `${envConfig.baseApi}/panel-reference/all`;

      if (searchText.trim()) {
        // Searching → no pagination params
        url += `?search=${encodeURIComponent(searchText)}`;
      } else {
        // No search → include pagination
        url += `?page=${page}&limit=${limit}`;
      }

      fetch(url, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          setAllTestPanels(data?.data?.panelData);
          setMeta(data?.data?.meta);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText, reload, page, limit, deletePannelId]);

  // delete options state
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${envConfig.baseApi}/panel-reference/delete/${deletePannelId}`,
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
      setDeletePanelId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
          <div className="flex items-center gap-3 bg-teal-700 px-6 py-3 rounded-lg shadow-md">
            <Scale size={26} className="text-white" />
            <h1 className="text-lg font-bold text-white">
              Reference range (Panel) Management
            </h1>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <span className="text-lg font-semibold">Register Panel </span>
            <Pencil size={20} className="text-white" />
          </button>
        </div>

        {/* ref List Card */}
        <div className="bg-white rounded-xl">
          {/* List Header */}
          <div className="sticky top-1">
            <div className="bg-teal-600 rounded-t-xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 ">
              <h2 className="text-xl font-semibold text-white">
                Panel List{" "}
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
            {allTestPanels?.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <Users size={40} className="text-teal-600" />
                </div>
                <p className="text-xl font-medium text-gray-600">
                  No refs found
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
                        Test Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ref Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-slate-500">
                    {allTestPanels?.map((ref, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/dashboard/refs/${ref._id}`}
                            className="text-teal-600 hover:text-teal-800"
                          >
                            {ref?.panelName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ref?.refPanelName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {ref?.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-pre-line">
                          {ref?.tests.map((sd, i) => (
                            <span key={i} className="block">
                              {sd?.testName}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              // onClick={() => setToUpdateTestRef(ref)}
                              title="Update data"
                              className="p-2 bg-teal-100 hover:bg-teal-200 rounded-lg text-teal-600 transition cursor-pointer"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              title="Delete"
                              onClick={() => setDeletePanelId(ref?._id!)}
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

            {allTestPanels === null && (
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
          <RefPanelCraeteForm
            setIsOpen={setIsOpen}
            setReload={setReload}
            reload={reload}
          />
        )}

        {/* confirm delete modal */}
        {deletePannelId && (
          <FixedPop>
            <div className="text-center bg-white rounded-lg p-6 max-w-md w-full mx-auto shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do You want to delete the pannel?
              </h3>

              <hr />
              <br />

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeletePanelId(null)}
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
    </div>
  );
}

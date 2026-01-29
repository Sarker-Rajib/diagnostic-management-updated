"use client";
import ServiceManageForm from "@/components/Services/ServiceForm";
import { envConfig } from "@/config/envConfig";
import { IMeta, IServiceData } from "@/interfaces";
import {
  ChevronLeft,
  ChevronRight,
  PenBoxIcon,
  Pencil,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

export default function ServiceManagaPage() {
  const [reload, setReload] = useState<boolean>(false);
  const [createService, setCreateService] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<[IServiceData] | null>(null);

  const [meta, setMeta] = useState<IMeta | null>(null);

  //  /// // //
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Build URL conditionally
      let url = `${envConfig.baseApi}/services/all`;

      if (searchText.trim()) {
        // Searching → no pagination params
        url += `?search=${encodeURIComponent(searchText)}`;
        console.log(url);
      } else {
        // No search → include pagination
        url += `?page=${page}&limit=${limit}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setServiceData(data?.data?.serviceData);
          setMeta(data?.data?.meta);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText, reload, page, limit]);

  return (
    <div className="p-4 relative bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
        <div className="flex items-center gap-3 px-6 py-2 rounded-lg shadow-md">
          <Users size={26} className="text-teal-600" />
          <h1 className="text-xl font-bold text-teal-600">
            Service Management
          </h1>
        </div>

        <button
          onClick={() => setCreateService(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <span className="text-lg font-semibold">Register Service</span>
          <Pencil size={20} className="text-white" />
        </button>
      </div>

      {/* Service List Card */}
      <div className="bg-white rounded-xl">
        {/* List Header */}
        <div className="sticky top-1">
          <div className="bg-teal-600 rounded-t-xl px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-4 ">
            <h2 className="text-xl font-semibold text-white">
              Service List{" "}
              {meta && (
                <span className="text-sm">( Total : {meta.total} )</span>
              )}
            </h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="text-gray-700 w-full pl-4 pr-10 py-2 rounded-lg border placeholder:text-amber-100 focus:ring-2 focus:ring-teal-300"
                />
                <Search
                  size={20}
                  className="absolute right-3 top-2.5 text-teal-600"
                />
              </div>

              {/* service Controls */}
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

        {/* services Table */}

        {serviceData && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    SL
                  </th>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    Service Name
                  </th>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    Test Name
                  </th>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    Price
                  </th>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    Department
                  </th>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    Report Group
                  </th>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    Profile
                  </th>
                  <th className="py-1 px-4 text-left font-semibold text-gray-700 text-sm border-b">
                    Service Code
                  </th>
                  <th className="py-1 px-4 text-center font-semibold text-gray-700 text-sm border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-slate-500">
                {serviceData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="transition-all duration-200 hover:bg-blue-50 hover:shadow-sm"
                  >
                    <td className="py-1 px-4 text-gray-800 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-1 px-4 text-gray-800 font-medium">
                      {item.serviceName}
                    </td>
                    <td className="py-1 px-4 text-gray-700">{item.testName}</td>
                    <td className="py-1 px-4 text-gray-900 font-semibold">
                      ৳{item.price}
                    </td>
                    <td className="py-1 px-4 text-gray-700">
                      {item.department}
                    </td>
                    <td className="py-1 px-4 text-gray-700">
                      {item.reportGroup}
                    </td>
                    <td className="py-1 px-4 text-gray-700">{item.profile}</td>
                    <td className="py-1 px-4 text-gray-700 font-mono text-sm">
                      {item.serviceCode}
                    </td>
                    <td className="py-1 px-4 text-center">
                      <Link
                        href={`/admin-dashboard/service-management/${item._id}`}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:shadow-sm transition-all duration-200 cursor-pointer"
                      >
                        <PenBoxIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {serviceData === null && (
          <div className="py-12 flex justify-center">
            <div className="text-center">
              <PropagateLoader color="#0d9488" />
              <p className="mt-4 text-gray-600">Loading Services...</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Header */}
      {createService && (
        <ServiceManageForm
          setReload={setReload}
          reload={reload}
          setIsOpen={setCreateService}
        />
      )}
    </div>
  );
}

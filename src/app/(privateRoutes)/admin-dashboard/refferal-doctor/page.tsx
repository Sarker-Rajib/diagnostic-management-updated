"use client";

import FixedPop from "@/components/fixedPop";
import { envConfig } from "@/config/envConfig";
import { IMeta } from "@/types";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { PropagateLoader } from "react-spinners";
import { IRefferalDoctor } from "@/types/billing";

const api = {
  create: async (data: Partial<IRefferalDoctor>) => {
    return fetch(`${envConfig.baseApi}/ref-doctor/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<IRefferalDoctor>) => {
    return fetch(`${envConfig.baseApi}/ref-doctor/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },

  remove: async (id: string) => {
    return fetch(`${envConfig.baseApi}/ref-doctor/delete/${id}`, {
      method: "DELETE",
    });
  },
};

export default function ReferralDoctorPage() {
  const [data, setData] = useState<IRefferalDoctor[]>([]);
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<IRefferalDoctor | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [reload, setReload] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState("");

  const { control, handleSubmit, reset } = useForm<IRefferalDoctor>({
    defaultValues: {
      name: "",
      institute: "",
    },
  });

  //   load data
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      // Build URL conditionally
      let url = `${envConfig.baseApi}/ref-doctor/all`;

      if (search.trim()) {
        // Searching → no pagination params
        url += `?search=${encodeURIComponent(search)}`;
      } else {
        // No search → include pagination
        url += `?page=${page}&limit=${limit}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setData(data?.data?.data || []);
          setMeta(data?.data?.meta || null);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, reload, page, limit]);

  //  control edit state
  useEffect(() => {
    if (edit) {
      reset(edit);
    } else {
      reset({
        name: "",
        institute: "",
      });
    }
  }, [edit]);

  const onSubmit = async (form: IRefferalDoctor) => {
    if (!form.name || !form.institute) return;

    setLoading(true);
    try {
      if (edit && editId) {
        const data = await api.update(editId, form);

        if (data.ok) {
          toast.success("Updated successfully");
        }
      } else {
        const data = await api.create(form);

        if (data.ok) {
          toast.success("Created successfully");
        }
      }
    } catch {
      toast.error("Operation failed");
    } finally {
      setEditId(null);
      setEdit(null);
      setOpen(false);
      setLoading(false);
      setReload(!reload);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await api.remove(deleteId);
      toast.success("Deleted successfully");
      setDeleteId(null);
      setReload(!reload);
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-1 bg-white rounded-xl border">
      <div className="pb-2 flex justify-between items-center">
        <p className="text-xl ps-2">* Refferel Doctor Management</p>
        <button
          onClick={() => setOpen(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center border-2 border-amber-500"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>
      {/* List Header */}
      <div className="sticky top-1">
        <div className="bg-teal-600 rounded-t-xl px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-4 ">
          <h2 className="text-xl font-semibold text-white">
            Refferal doctor List{" "}
            {meta && <span className="text-sm">( Total : {meta.total} )</span>}
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative grow sm:grow-0 sm:w-64">
              <input
                type="text"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              {!search.trim() && meta && (
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

      {/* TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Institute</th>
              <th className="p-2 text-left">Referral ID</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, i) => (
              <tr key={item._id} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.institute}</td>
                <td className="p-2">{item.refferalId}</td>

                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEdit(item);
                      setEditId(item._id!);
                      setOpen(true);
                    }}
                    className="p-2 bg-blue-100 rounded"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => setDeleteId(item._id!)}
                    className="p-2 bg-red-100 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="flex justify-center p-6">
          <PropagateLoader color="#0d9488" />
        </div>
      )}

      {/* MODAL */}
      {open && (
        <FixedPop>
          <div className="bg-white p-2 rounded-lg w-125 mx-auto">
            {/* Header strip */}
            <div className="bg-linear-to-r from-teal-600 to-indigo-600 text-white p-4 rounded-xl">
              <h2 className="text-lg font-semibold">
                {edit ? "Update Referral Doctor" : "Create Referral Doctor"}
              </h2>
              <p className="text-xs text-white/80">
                Fill in doctor information carefully
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Doctor Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Dr. John Doe"
                      className="mt-1 w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-teal-500
                     transition"
                    />
                  )}
                />
              </div>

              {/* Institute */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Institute / Hospital
                </label>
                <Controller
                  name="institute"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Dhaka Medical College"
                      className="mt-1 w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-teal-500
                     transition"
                    />
                  )}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setEdit(null);
                    setEditId(null);
                    reset({
                      name: "",
                      institute: "",
                    });
                  }}
                  className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200
                 text-gray-700 font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-linear-to-r from-teal-600 to-indigo-600
                 text-white font-medium shadow hover:opacity-90 transition"
                >
                  {edit ? "Update Doctor" : "Save Doctor"}
                </button>
              </div>
            </form>
          </div>
        </FixedPop>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <FixedPop>
          <div className="bg-white p-5 rounded-lg w-125 mx-auto border-2 border-red-500">
            <h2 className="text-lg font-bold">Delete Doctor?</h2>
            <p className="text-gray-600 my-3">This action cannot be undone.</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
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

"use client";

import FixedPop from "@/components/fixedPop";
import TiptapEditor from "@/components/TextEditor";
import { envConfig } from "@/config/envConfig";
import { IMeta } from "@/types";
import { IUSGTemplate } from "@/types/usgReport";
import {
  ChevronLeft,
  ChevronRight,
  DeleteIcon,
  Pencil,
  Search,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { PropagateLoader } from "react-spinners";
import { toast } from "sonner";

// API Service
const apiService = {
  createTemplate: async (template: IUSGTemplate) => {
    try {
      const response = await fetch(`${envConfig.baseApi}/usg-template/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error(`Failed to create template: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating template:", error);
      throw error;
    }
  },

  // PUT update template (Y)
  updateTemplate: async (id: string, template: IUSGTemplate) => {
    try {
      const response = await fetch(
        `${envConfig.baseApi}/usg-template/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(template),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update template: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  },

  // DELETE template (Z)
  deleteTemplate: async (id: string) => {
    try {
      const response = await fetch(
        `${envConfig.baseApi}/usg-template/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete template: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  },
};

export default function TemplatePage() {
  const [data, setData] = useState<IUSGTemplate[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  // reload state
  const [reload, setReload] = useState(true);
  // edit / update states
  const [isEdit, setIsEdit] = useState<IUSGTemplate | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  // delete states
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // update states
  const [meta, setMeta] = useState<IMeta | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Load all templates on mount (A)
  useEffect(() => {
    loadTemplates();
  }, [reload]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${envConfig.baseApi}/usg-template/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Something went wrong");
      }

      const result = await response.json();

      setMeta(result.data.meta);
      setData(result.data.templates);
      toast.success("Data Loaded successfully!");
    } catch (error) {
      console.error("Error fetching templates:", error);
      // throw error;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      template: "",
    },
  });
  useEffect(() => {
    if (isEdit) {
      reset({
        title: isEdit.title || "",
        template: isEdit.template || "",
      });
    } else {
      reset({
        title: "",
        template: "",
      });
    }
  }, [isEdit, reset]);
  // -----------------------------------------------------

  const onSubmit = async (data: any) => {
    if (!data.title.trim() || !data.template.trim()) return;

    try {
      setLoading(true);

      if (isEdit && currentId) {
        await apiService.updateTemplate(currentId, data);
        setCurrentId(null);
        setIsEdit(null);
      } else {
        const res = await apiService.createTemplate(data);
        if (res) toast.success("Data saved successfully");
      }

      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setReload(!reload);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setLoading(true);
      await apiService.deleteTemplate(deleteConfirm);
      toast.success("Data deleted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setDeleteConfirm(null);
      setReload(!reload);
    }
  };

  return (
    <div className="max-w-400 mx-auto border border-white rounded-xl">
      {/* data table */}
      <div className="bg-white rounded-xl">
        {/* List Header */}
        <div className="sticky top-1">
          <div className="bg-teal-600 rounded-t-xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 ">
            <div>
              <h2 className="text-xl font-semibold text-white">
                USG Template List
                {meta && (
                  <span className="text-sm">( Total : {meta.total} )</span>
                )}
              </h2>
              <button
                className="px-5 py-1 bg-linear-to-r from-green-600 border to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={() => setIsOpen(true)}
              >
                Create Template
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Box */}
              <div className="relative grow sm:grow-0 sm:w-64">
                <input
                  type="text"
                  placeholder="Search template..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="text-gray-700 w-full pl-4 pr-10 py-2 bg-white rounded-lg border focus:ring-2 focus:ring-teal-300"
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
          {data?.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Users size={40} className="text-teal-600" />
              </div>
              <p className="text-xl font-medium text-gray-600">
                No Templates were found
              </p>
              <button
                onClick={() => setIsOpen(true)}
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition"
              >
                Create Template
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-slate-500">
                  {data?.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">{i + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setIsEdit(item);
                              setCurrentId(item?._id!);
                              setIsOpen(true);
                            }}
                            title="Update data"
                            className="p-2 bg-teal-100 hover:bg-teal-200 rounded-lg text-teal-600 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item?._id!)}
                            title="Delete"
                            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-600 transition"
                          >
                            <DeleteIcon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {loading && (
            <div className="py-12 flex justify-center">
              <div className="text-center">
                <PropagateLoader color="#0d9488" />
                <p className="mt-4 text-gray-600">Loading template...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/*  */}
      {isOpen && (
        <FixedPop>
          <div className="max-w-4xl mx-auto bg-white/55 rounded-lg overflow-hidden">
            <div className="bg-linear-to-b to-teal-600 from-sky-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                {isEdit ? "Edit Template" : "Create Template"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {isEdit
                  ? "Modify your template content"
                  : "Add a new message template"}
              </p>
            </div>
            <div className="p-3">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="USG of W/A ..."
                      disabled={loading}
                      className="w-full border border-sky-500 p-3 rounded-xl"
                    />
                  )}
                />
                <div className="pb-2"></div>
                <Controller
                  name="template"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <div>
                        <TiptapEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                        {fieldState.error && (
                          <p className="text-sm text-destructive">
                            {fieldState.error.message}
                          </p>
                        )}
                      </div>
                    );
                  }}
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEdit(null);
                    }}
                    disabled={loading}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-linear-to-r from-green-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                    )}
                    {isEdit
                      ? loading
                        ? "Updating..."
                        : "Update Template"
                      : loading
                        ? "Saving..."
                        : "Save Template"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </FixedPop>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <FixedPop>
          <div className="max-w-2xl mx-auto bg-white/55 rounded-lg">
            <div className="bg--to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-amber-600">
                Delete Template ?
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this template? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={loading}
                  className="px-4 py-2 border bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                  )}
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </FixedPop>
      )}
    </div>
  );
}

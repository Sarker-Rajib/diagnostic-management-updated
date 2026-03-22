"use client";

import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";

interface TemplateItem {
  id?: string;
  templateTitle: string;
  templateData: string;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-api.com";

// API Service
const apiService = {
  // GET all templates (A)
  getAllTemplates: async (): Promise<TemplateItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/templates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching templates:", error);
      throw error;
    }
  },

  // POST create new template (X)
  createTemplate: async (template: TemplateItem): Promise<TemplateItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/templates`, {
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
  updateTemplate: async (
    id: string,
    template: TemplateItem,
  ): Promise<TemplateItem> => {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      });

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
  deleteTemplate: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
  const [data, setData] = useState<TemplateItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [form, setForm] = useState<TemplateItem>({
    templateTitle: "",
    templateData: "",
  });

  // Load all templates on mount (A)
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const templates = await apiService.getAllTemplates(); // A - Get all templates
      setData(templates);
    } catch (err) {
      setError("Failed to load templates. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter templates based on search
  const filteredData = data.filter(
    (item) =>
      item.templateTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.templateData.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Extract variables from template content
  const extractVariables = (text: string) => {
    const matches = text.match(/{{(.*?)}}/g);
    return matches
      ? matches.map((m) => m.replace(/[{}]/g, "")).join(", ")
      : "No variables";
  };

  // Count variables
  const getVariableCount = (text: string) => {
    const matches = text.match(/{{(.*?)}}/g);
    return matches ? matches.length : 0;
  };

  const openAddModal = () => {
    setForm({ templateTitle: "", templateData: "" });
    setIsEdit(false);
    setCurrentId(null);
    setIsOpen(true);
  };

  const openEditModal = (id: string) => {
    const template = data.find((item) => item.id === id);
    if (template) {
      setForm({
        templateTitle: template.templateTitle,
        templateData: template.templateData,
      });
      setCurrentId(id);
      setIsEdit(true);
      setIsOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!form.templateTitle.trim() || !form.templateData.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      if (isEdit && currentId) {
        // Y - Update template
        const updatedTemplate = await apiService.updateTemplate(
          currentId,
          form,
        );
        setData(
          data.map((item) => (item.id === currentId ? updatedTemplate : item)),
        );
        setSuccessMessage("Template updated successfully!");
      } else {
        // X - Create new template
        const newTemplate = await apiService.createTemplate(form);
        setData([...data, newTemplate]);
        setSuccessMessage("Template created successfully!");
      }

      setIsOpen(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        isEdit ? "Failed to update template." : "Failed to create template.",
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      setSubmitting(true);
      setError(null);

      // Z - Delete template
      await apiService.deleteTemplate(deleteConfirm);
      setData(data.filter((item) => item.id !== deleteConfirm));
      setSuccessMessage("Template deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to delete template.");
      console.error(err);
    } finally {
      setSubmitting(false);
      setDeleteConfirm(null);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg--to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg--to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Success Message */}
        {/* // <AnimatePresence> */}
        {successMessage && (
          // <motion.div
          //   initial={{ opacity: 0, y: -20 }}
          //   animate={{ opacity: 1, y: 0 }}
          //   exit={{ opacity: 0, y: -20 }}
          //   className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg"
          // >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {successMessage}
          </div>
          // /* </motion.div> */}
        )}
        {/* </AnimatePresence> */}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg--to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg--to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Template Studio
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Manage your message templates with dynamic variables
              </p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            disabled={submitting}
            className="group relative px-5 py-2.5 bg--to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-medium text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create Template</span>
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50/50 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
              <svg
                className="w-3.5 h-3.5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                {data.length} Total
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <svg
                className="w-3.5 h-3.5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                {data.reduce(
                  (sum, t) =>
                    sum + (t.templateData.match(/{{(.*?)}}/g)?.length || 0),
                  0,
                )}{" "}
                Variables
              </span>
            </div>
            <button
              onClick={loadTemplates}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Refresh"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No templates found
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first template to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                + Create Template
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredData.map((item, index) => {
              const variableCount = getVariableCount(item.templateData);

              return (
                // <motion.div
                //   key={item.id || index}
                //   initial={{ opacity: 0, y: 20 }}
                //   animate={{ opacity: 1, y: 0 }}
                //   transition={{ duration: 0.3, delay: index * 0.05 }}
                //   className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/80 hover:border-gray-300 transition-all duration-300 overflow-hidden"
                // >
                <div className="p-5">
                  {/* Title Section */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                        {item.templateTitle}
                      </h3>
                      {variableCount > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                              />
                            </svg>
                            {variableCount}{" "}
                            {variableCount === 1 ? "variable" : "variables"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => item.id && openEditModal(item.id)}
                        disabled={submitting}
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => item.id && setDeleteConfirm(item.id)}
                        disabled={submitting}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                    <p className="text-gray-600 text-sm line-clamp-3 font-mono">
                      {item.templateData}
                    </p>
                  </div>

                  {/* Variables Preview */}
                  {variableCount > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-400 mb-1">Variables:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.templateData
                          .match(/{{(.*?)}}/g)
                          ?.map((varMatch, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-md"
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              {varMatch.replace(/[{}]/g, "")}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                // /* </motion.div> */
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {/* <AnimatePresence> */}
      {isOpen && (
        // <motion.div
        //   initial={{ opacity: 0 }}
        //   animate={{ opacity: 1 }}
        //   exit={{ opacity: 0 }}
        //   className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        //   onClick={() => !submitting && setIsOpen(false)}
        // >
        //   <motion.div
        //     initial={{ scale: 0.95, opacity: 0 }}
        //     animate={{ scale: 1, opacity: 1 }}
        //     exit={{ scale: 0.95, opacity: 0 }}
        //     onClick={(e) => e.stopPropagation()}
        //     className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        //   >
        <>
          <div className="bg--to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? "Edit Template" : "Create Template"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {isEdit
                ? "Modify your template content"
                : "Add a new message template"}
            </p>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Title
              </label>
              <input
                type="text"
                placeholder="e.g., Welcome Email"
                value={form.templateTitle}
                onChange={(e) =>
                  setForm({ ...form, templateTitle: e.target.value })
                }
                disabled={submitting}
                className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none p-3 rounded-xl transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Content
              </label>
              <textarea
                placeholder="Use {{variable}} for dynamic content&#10;Example: Hello {{name}}, welcome!"
                value={form.templateData}
                onChange={(e) =>
                  setForm({ ...form, templateData: e.target.value })
                }
                rows={5}
                disabled={submitting}
                className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none p-3 rounded-xl resize-none font-mono text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-2">
                <span className="font-medium">Tip:</span> Use {"{{variable}}"}{" "}
                syntax for dynamic content
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={submitting}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 bg--to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
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
                  ? submitting
                    ? "Updating..."
                    : "Update Template"
                  : submitting
                    ? "Saving..."
                    : "Save Template"}
              </button>
            </div>
          </div>
        </>
        //     </motion.div>
        //</motion.div>
      )}
      {/* </AnimatePresence> */}

      {/* Delete Confirmation Modal */}
      {/* <AnimatePresence> */}
      {deleteConfirm !== null && (
        // <motion.div
        //   initial={{ opacity: 0 }}
        //   animate={{ opacity: 1 }}
        //   exit={{ opacity: 0 }}
        //   className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
        //   onClick={() => !submitting && setDeleteConfirm(null)}
        // >
        //   <motion.div
        //     initial={{ scale: 0.95, opacity: 0 }}
        //     animate={{ scale: 1, opacity: 1 }}
        //     exit={{ scale: 0.95, opacity: 0 }}
        //     onClick={(e) => e.stopPropagation()}
        //     className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
        //   >
        <>
          <div className="bg--to-r from-red-500 to-red-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Delete Template
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this template? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={submitting}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && (
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
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </>
        //  {/* </motion.div>
        // </motion.div> */}
      )}
      {/* </AnimatePresence> */}
    </div>
  );
}

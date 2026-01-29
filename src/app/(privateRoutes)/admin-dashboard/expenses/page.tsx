"use client";
import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  Calendar,
  DollarSign,
  FileText,
  Search,
  User,
  X,
} from "lucide-react";
import { envConfig } from "@/config/envConfig";
import { toast } from "sonner";
import { accessToken } from "@/services/AuthServices";

const ExpenseTablePage = () => {
  const [expenses, setExpenses] = useState<Array<Expense> | null>(null);
  const [addForm, setAddForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = await accessToken();
        const delayDebounce = setTimeout(async () => {
          try {
            const response = await fetch(`${envConfig.baseApi}/expense/all`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
            });

            const data = await response.json();
            if (data.success) {
              toast.success(`${data.message}`);
              setExpenses(data?.data || []);
            } else {
              toast.error(`${data.message}`);
            }
          } catch (error) {
            console.error("Error fetching expenses:", error);
            // Consider setting an error state here
          }
        }, 300);

        return () => clearTimeout(delayDebounce);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    fetchExpenses();
  }, []);

  const categories = [
    "Office Supplies",
    "Software",
    "Utilities",
    "Maintenance",
    "Marketing",
    "Equipment",
    "Salary",
    "Travel",
  ] as const;

  interface Expense {
    id?: string;
    category: string;
    description: string;
    amount: number;
    date: string;
    entryBy: string;
  }

  interface ApiResponse {
    data: Expense;
    // Add other response properties if needed
    success?: boolean;
    message?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newExpense: Expense = {
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string) || 0,
      date: formData.get("date") as string,
      entryBy: formData.get("entryBy") as string,
    };

    const token = await accessToken();

    fetch(`${envConfig.baseApi}/expense/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(newExpense),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        if (data.success) {
          toast.success("Expense added successfully!");
        } else {
          toast.error("Something went wrong !");
        }
        setAddForm(false);
      })
      .catch((error: Error) => {
        console.error("Error adding expense:", error.message);
        // You might want to add error state handling here
      });
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Controls */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={() => setAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sl
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                // onClick={() => handleSort("date")}
              >
                <span className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </span>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                // onClick={() => handleSort("category")}
              >
                <span className="flex items-center">
                  Category
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                // onClick={() => handleSort("amount")}
              >
                <span className="flex items-center">
                  Amount
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry By
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses && expenses.length > 0 ? (
              expenses.map((expense, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {i + 1}.
                  </th>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.entryBy}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No expenses found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to{" "}
          {/* <span className="font-medium">{filteredExpenses.length}</span> of{" "} */}
          <span className="font-medium">{expenses?.length}</span> expenses
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>

      {/* add expense form  */}
      {addForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            // onClick={onClose}
          ></div>

          {/* Modal container */}
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal content */}
            <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Add New Expense</h2>
                <button
                  onClick={() => setAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Field */}
                  <div>
                    <label
                      htmlFor="category"
                      className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description Field */}
                  <div>
                    <label
                      htmlFor="description"
                      className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className={`w-full px-3 py-2 border  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="What was this expense for?"
                    />
                  </div>

                  {/* Amount Field */}
                  <div>
                    <label
                      htmlFor="amount"
                      className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                    >
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        step="0.01"
                        min="0"
                        className={`w-full pl-8 pr-3 py-2  border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Date Field */}
                  <div>
                    <label
                      htmlFor="date"
                      className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                    >
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Entry By Field */}
                  <div>
                    <label
                      htmlFor="entryBy"
                      className=" text-sm font-medium text-gray-700 mb-1 flex items-center"
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Entered By
                    </label>
                    <input
                      type="text"
                      id="entryBy"
                      name="entryBy"
                      className={`w-full px-3 py-2 border  "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Who is entering this expense?"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => setAddForm(false)}
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTablePage;

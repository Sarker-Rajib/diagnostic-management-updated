import { envConfig } from "@/config/envConfig";
import { accessToken } from "@/services/AuthServices";
import { IPatient } from "@/types";
import { X } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { toast } from "sonner";

export const CreatePatientComponent = ({
  setIsOpen,
  setReload,
  reload,
  setNewPatient,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setReload?: Dispatch<SetStateAction<boolean>>;
  reload?: boolean;
  setNewPatient?: Dispatch<SetStateAction<IPatient | null>>;
}) => {
  const [saving, setSaving] = useState<boolean>(false);

  const [patient, setPatient] = useState<Partial<IPatient>>({
    fullName: "",
    gender: "",
    age: 0,
    phoneNumber: "",
    email: "",
    address: "",
  });

  // Handle Input Change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  // Handle Form Submission for creating patient
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSaving(true);

    if (patient.phoneNumber?.length !== 11) {
      toast.error("Mobile number should be 11 digit !");
      setSaving(false);
      return;
    }

    const payload = {
      fullName: patient.fullName,
      gender: patient.gender,
      age: Number(patient.age),
      phoneNumber: patient.phoneNumber,
      ...(patient.email ? { email: patient.email } : {}),
      ...(patient.address ? { address: patient.address } : {}),
    };

    const acc = await accessToken();

    fetch(`${envConfig.baseApi}/patient/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${acc}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(`${data?.message}`);
        setPatient({
          fullName: "",
          gender: "",
          age: 0,
          phoneNumber: "",
          email: "",
          address: "",
        });
        if (data?.success) {
          setIsOpen(false);

          if (setNewPatient) {
            setNewPatient(data?.data);
          }
        }
        setSaving(false);

        if (setReload) {
          setReload(!reload);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.success(`${error?.message}`);
        setSaving(false);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-teal-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Add New Patient</h2>
          <button
            className="text-white hover:text-teal-200 transition"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-slate-600">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={patient.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={patient.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={patient.age || ""}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={patient.phoneNumber}
                  onChange={handleChange}
                  required
                  pattern="\d{11}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="11 digits"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={patient.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={patient.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition ${
                  saving
                    ? "bg-teal-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }`}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Processing...
                  </span>
                ) : (
                  "Save Patient"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

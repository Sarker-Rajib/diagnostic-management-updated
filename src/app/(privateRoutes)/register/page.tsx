"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ChevronLeft, Users } from "lucide-react";
import { envConfig } from "@/config/envConfig";
import { toast } from "sonner";
import { accessToken } from "@/services/AuthServices";
// import { useRouter } from "next/navigation";
import { IPatient } from "@/types";
import Link from "next/link";

export default function PatientRegisterPage() {
  const [reload, setReload] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [accToken, setAcctoken] = useState<string>("");
  //   const router = useRouter();

  const [patient, setPatient] = useState<Partial<IPatient>>({
    fullName: "",
    gender: "",
    age: 0,
    phoneNumber: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = await accessToken();
        if (token) {
          setAcctoken(token);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Error fetching patients");
      }
    };

    fetchPatients();
  }, [reload]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (
      !patient.fullName ||
      !patient.gender ||
      !patient.age ||
      !patient.phoneNumber
    ) {
      toast.error("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }

    if (!/^\d{11}$/.test(patient.phoneNumber)) {
      toast.error("Phone number must be 11 digits long.");
      setSubmitting(false);
      return;
    }

    if (patient.email && !/^\S+@\S+\.\S+$/.test(patient.email)) {
      toast.error("Invalid email format.");
      setSubmitting(false);
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

    try {
      const response = await fetch(`${envConfig.baseApi}/patient/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        toast.success(data.message || "Patient created successfully");
        setPatient({
          fullName: "",
          gender: "",
          age: 0,
          phoneNumber: "",
          email: "",
          address: "",
        });
        setReload(!reload);
      } else {
        toast.error(`Error creating patient: ${data?.message}`);
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      toast.error("Error creating patient");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="p-3 bg-teal-100 rounded-full">
            <Users size={32} className="text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-teal-800">
            Patient Registration
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-teal-600 px-6 py-4 relative">
            <h2 className="text-xl font-semibold text-white">
              Patient Information
            </h2>
            <p className="text-teal-100 text-sm">
              Please fill in all required fields
            </p>

            <Link
              href="/"
              className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center border pe-3 rounded border-amber-300"
            >
              <ChevronLeft size={26} /> Back
            </Link>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={patient.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="Enter patient's full name"
                  />
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                >
                  <option value="" disabled hidden>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Enter age"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={patient.phoneNumber}
                    onChange={handleChange}
                    required
                    pattern="\d{11}"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    placeholder="11-digit phone number"
                  />
                  <span className="absolute right-3 top-3 text-xs text-gray-500">
                    (11 digits)
                  </span>
                </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="patient@example.com"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  placeholder="Enter full address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg"
                }`}
              >
                {submitting ? (
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
                  "Register Patient"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

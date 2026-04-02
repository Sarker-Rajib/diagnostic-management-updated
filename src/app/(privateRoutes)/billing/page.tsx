"use client";

import FixedPop from "@/components/fixedPop";
import Invoice from "@/components/Invoice/Invoice";
import { CreatePatientComponent } from "@/components/PatientComponents/CreatePatient";
import { envConfig } from "@/config/envConfig";
import { accessToken } from "@/services/AuthServices";
import { IInvoice, IPatient, IServiceItem } from "@/types";
import { IRefferalDoctor } from "@/types/billing";
import { FPrint } from "@/utility/printComponent";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function BillPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState<boolean>(false);
  // searched data
  const [services, setServices] = useState<IServiceItem[]>([]);
  const [patients, setPatients] = useState<IPatient[]>([]);
  //
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  //
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedServices, setSelectedServices] = useState<IServiceItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [refDoctors, setRefDoctors] = useState<IRefferalDoctor[] | null>();
  const [refBy, setRefBy] = useState<{
    name: string;
    refferalId: string;
  } | null>(null);

  const subtotal = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const discount = useMemo(() => {
    let value = 0;

    if (discountPercentage > 0) {
      value = (subtotal * discountPercentage) / 100;
    } else if (discountAmount > 0) {
      value = discountAmount;
    }

    return Math.round(value);
  }, [subtotal, discountPercentage, discountAmount]);

  const totalAfterDiscount = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const dueAmount = useMemo(() => {
    return paidAmount < totalAfterDiscount
      ? totalAfterDiscount - paidAmount
      : 0;
  }, [paidAmount, totalAfterDiscount]);

  const exchange = useMemo(() => {
    return paidAmount > totalAfterDiscount
      ? paidAmount - totalAfterDiscount
      : 0;
  }, [paidAmount, totalAfterDiscount]);

  const collectedPaidAmount = useMemo(() => {
    return paidAmount > totalAfterDiscount ? totalAfterDiscount : paidAmount;
  }, [paidAmount, totalAfterDiscount]);

  const paymentStatus = useMemo(() => {
    if (discount === subtotal) return "Free";
    if (dueAmount === 0) return "Paid";
    if (paidAmount > 0) return "Partial";
    return "Unpaid";
  }, [dueAmount, paidAmount]);

  const [invoice, setInvoice] = useState<IInvoice>();
  const [shouldPrint, setShouldPrint] = useState<boolean>(false);

  useEffect(() => {
    if (invoice && shouldPrint) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [invoice, shouldPrint]);

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 1) {
      setPatients([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetch(`${envConfig.baseApi}/patient/lookup?search=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setPatients(data?.data || []);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 300);
  };

  const handleServiceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 1) {
      setPatients([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetch(`${envConfig.baseApi}/services/lookup?search=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setServices(data?.data || []);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 300);
  };

  const handleRefDoctorSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length < 1) {
      setPatients([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetch(`${envConfig.baseApi}/ref-doctor/lookup?search=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setRefDoctors(data?.data || []);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 300);
  };

  // cursor pointer
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!services?.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < services.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : services.length - 1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelectService(services[activeIndex]);
      }
    }
  };

  const handleSelectService = (service: any) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.serviceCode === service.serviceCode);

      const { _id, ...rest } = service;

      if (exists) return prev;

      return [...prev, rest];
    });

    // reset
    setServices([]);
    setActiveIndex(-1);

    // clear + focus input
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  // create bill function
  const handleCreatBilling = async () => {
    setSaving(true);
    const token = await accessToken();
    if (!token) {
      toast.error("Token Error");
      return;
    }

    if (!(selectedServices.length > 0)) {
      toast.error("Select a service !");
      setSaving(false);
      return;
    }

    if (selectedPatient === null) {
      toast.error("Select a Patient !");
      setSaving(false);
      return;
    }

    if (collectedPaidAmount === 0 && discount !== subtotal) {
      toast.error("Paid Amount should not be 0 !");
      setSaving(false);
      return;
    }

    if (!refBy) {
      toast.error("Please Select a Refferel doctor !");
      setSaving(false);
      return;
    }

    const payload = {
      patientInfo: selectedPatient?._id, // Types.ObjectId;
      pId: selectedPatient?.pId, // string;
      refBy,
      services: selectedServices, // Array<IServiceBill>;
      subTotal: subtotal, // number;
      discount: discount, // number;
      totalAmount: totalAfterDiscount, // number;
      paidAmount: collectedPaidAmount, // number;
      dueAmount: dueAmount, // number;
      paymentStatus: paymentStatus, // (typeof CPaymentStatus)[number];
      paymentMethod: paymentMethod, // (typeof CPaymentMethod)[number];
    };

    try {
      const billResponse = await fetch(`${envConfig.baseApi}/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(payload),
      });

      const billData = await billResponse.json();

      if (billData.success) {
        toast.success("Bill saved successfully!");
        setInvoice(billData.data);

        setDiscountAmount(0);
        setDiscountPercentage(0);
        setSelectedServices([]);
        setSelectedPatient(null);
        setPaidAmount(0);
        setRefBy(null);
        setShouldPrint(true);
      } else {
        toast.error("Failed to save Bill");
        toast.error(billData.message);
      }
    } catch (error) {
      console.log("Error saving Bill:", error);
      toast.error("Error saving Bill");
    }

    setSaving(false);
  };

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      FPrint(printRef.current);
    }
  };

  return (
    <div className="p-2 px-4 max-w-7xl mx-auto">
      <div>
        {/* Header - Improved */}
        <div className="bg-linear-to-r from-teal-600 to-teal-500 rounded px-2 shadow-lg">
          <button className="text-white mx-1 px-2 p-1 bg-green-700 cursor-pointer">
            Create Bill
          </button>
          <button className="text-white mx-1 px-2 p-1 bg-amber-700 cursor-pointer">
            Update/Refund Bill
          </button>
        </div>

        {/* Patient Search Section - Improved */}
        <div className="mb-3 bg-white rounded-xl shadow-lg">
          <div className="p-4">
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="relative">
                    <div className="border-2 border-teal-400 rounded-lg flex items-center p-2 bg-gray-50 transition-all focus-within:border-teal-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-200 focus-within:shadow-md">
                      <input
                        type="text"
                        placeholder="Search patients..."
                        onChange={handlePatientSearch}
                        onBlur={() => {
                          setTimeout(() => {
                            setPatients([]);
                          }, 200);
                        }}
                        className="text-gray-700 px-3 focus:outline-none w-full bg-transparent"
                      />
                      <Search
                        size={20}
                        className="text-teal-600 ml-2 shrink-0"
                      />
                    </div>
                    {patients?.length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-white z-50 border border-gray-200 rounded-lg shadow-xl mt-2 overflow-hidden">
                        <div className="custom-scroll max-h-64 overflow-y-auto">
                          <table className="w-full">
                            <thead className="bg-linear-to-r from-teal-50 to-teal-100 sticky top-0">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                  Age
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                  Phone
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {patients?.map((patient, i) => (
                                <tr
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    setPatients([]);
                                  }}
                                  key={i}
                                  className="hover:bg-linear-to-r hover:from-teal-50 hover:to-teal-100 cursor-pointer transition-all duration-150"
                                >
                                  <td className="px-4 py-3 text-sm font-medium text-teal-700">
                                    {patient?.pId}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-teal-600 font-medium">
                                    {patient?.fullName}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {patient?.age} Y
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {patient?.phoneNumber}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                  <hr className="my-2" />
                  <div>
                    <button
                      onClick={() => setIsOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white p-2 w-full font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      New Patient
                    </button>
                  </div>
                </div>
                {/* Patient info section - Improved */}
                <div className="bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl p-2 border border-teal-200">
                  <h3 className="text-lg font-semibold text-teal-700 mb-2 border-b border-teal-200">
                    Patient Information {`: ${selectedPatient?.pId}` || "—"}
                  </h3>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-teal-700 rounded-lg p-1 px-2.5 shadow-md">
                      <p className="text-teal-100 text-xs">Name</p>
                      <p className="text-white font-semibold truncate text-sm">
                        {selectedPatient?.fullName || "—"}
                      </p>
                    </div>

                    <div className="bg-teal-700 rounded-lg p-1 px-2.5 shadow-md">
                      <p className="text-teal-100 text-xs">Mobile</p>
                      <p className="text-white font-semibold truncate text-sm">
                        {selectedPatient?.phoneNumber || "—"}
                      </p>
                    </div>

                    <div className="bg-teal-700 rounded-lg p-1 px-2.5 shadow-md">
                      <p className="text-teal-100 text-xs">Age</p>
                      <p className="text-white font-semibold truncate text-sm">
                        {selectedPatient?.age || "—"}Y/{selectedPatient?.gender}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Billing Section - Improved */}
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Billing Details Section */}
            <div className="border border-gray-200 rounded-xl p-2 px-3 bg-white shadow-sm">
              {/* Referred doctor - Improved */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Referred By
                </label>
                {refBy?.name ? (
                  <div className="flex justify-between ps-2 items-center bg-linear-to-r from-sky-400 to-sky-500 rounded-lg shadow-md">
                    <p className="text-white font-medium">{`${refBy?.refferalId} - ${refBy?.name}`}</p>
                    <button
                      className="text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded-lg transition-all shadow-md"
                      type="button"
                      onClick={() => setRefBy(null)}
                    >
                      Change Doctor
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="border-2 border-teal-400 rounded-lg flex items-center p-2 bg-gray-50 transition-all focus-within:border-teal-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-200">
                      <input
                        id="refBy"
                        type="text"
                        placeholder="Search doctors..."
                        onChange={handleRefDoctorSearch}
                        onBlur={() => {
                          setTimeout(() => {
                            setRefDoctors([]);
                          }, 100);
                        }}
                        className="text-gray-700 px-3 focus:outline-none w-full bg-transparent"
                      />
                      <Search
                        size={20}
                        className="text-teal-600 ml-2 shrink-0"
                      />
                    </div>

                    {refDoctors!?.length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-white z-10 border border-amber-500 rounded-lg shadow-xl mt-2 overflow-hidden">
                        <div className="custom-scroll max-h-64 overflow-y-auto">
                          <table className="w-full">
                            <thead className="bg-linear-to-r from-teal-50 to-teal-100 sticky top-0">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                  RefID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                  Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                                  Institute
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {refDoctors?.map((doc, i) => (
                                <tr
                                  onClick={() =>
                                    setRefBy({
                                      name: doc.name,
                                      refferalId: doc.refferalId!,
                                    })
                                  }
                                  key={i}
                                  className="hover:bg-linear-to-r hover:from-teal-50 hover:to-teal-100 cursor-pointer transition-all duration-150"
                                >
                                  <td className="px-4 py-3 text-sm font-medium text-teal-700">
                                    {doc?.refferalId}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium text-teal-700">
                                    {doc?.name}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-teal-600">
                                    {doc?.institute}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <hr className="my-2" />
              {/*  service selection */}
              <div className="relative pb-1">
                <label className="text-gray-600 font-semibold block">
                  Search & Select Services
                </label>
                <div className="border-2 border-teal-400 rounded-lg flex items-center p-2 bg-gray-50 transition-all focus-within:border-teal-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-200">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search services..."
                    onChange={handleServiceSearch}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      setTimeout(() => {
                        setServices([]);
                      }, 200);
                    }}
                    className="text-gray-700 px-3 focus:outline-none w-full bg-transparent"
                  />
                  <Search size={20} className="text-teal-600 ml-2 shrink-0" />
                </div>

                {/* seleciton dropdown */}
                {services?.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white z-10 border border-gray-200 rounded-lg shadow-xl mt-2 overflow-hidden">
                    <div className="custom-scroll max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-linear-to-r from-teal-50 to-teal-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {services?.map((service, i) => (
                            <tr
                              onClick={() => handleSelectService(service)}
                              key={i}
                              className={`cursor-pointer transition-all duration-150
                                      ${
                                        i === activeIndex
                                          ? "bg-teal-100"
                                          : "hover:bg-linear-to-r hover:from-teal-50 hover:to-teal-100"
                                      }`}
                            >
                              <td className="px-4 py-3 text-sm font-medium text-teal-700">
                                {service?.serviceName}
                              </td>
                              <td className="px-4 py-3 text-sm text-teal-600 font-semibold">
                                ৳{service?.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Services - Improved */}
              <div className="min-h-56 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-linear-to-r from-teal-600 to-teal-500 p-3">
                  <p className="text-center font-bold text-white">
                    Selected Items ({selectedServices.length})
                  </p>
                </div>

                {selectedServices.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    No services selected
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 max-h-96 pt-1 overflow-y-auto">
                    {selectedServices?.map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 flex items-center gap-3">
                          <button
                            onClick={() =>
                              setSelectedServices((prev) =>
                                prev.filter(
                                  (s) => s.serviceCode !== service.serviceCode,
                                ),
                              )
                            }
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Remove"
                          >
                            <X size={18} />
                          </button>
                          {service.serviceName}
                        </span>
                        <span className="text-teal-700 font-semibold">
                          ৳{service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtotal - Improved */}
              <div className="text-right p-1 px-4 bg-linear-to-r from-gray-50 to-gray-100 rounded">
                <span className="font-bold text-lg text-gray-800">
                  Subtotal:
                </span>
                <span className="font-bold text-xl text-teal-700 ml-2">
                  ৳{subtotal}
                </span>
              </div>

              {/* Payment status */}
              {paymentStatus && (
                <div className="p-3 text-center text-lg font-medium rounded-xl bg-teal-100 text-teal-800">
                  {paymentStatus}
                </div>
              )}
            </div>

            <div className="space-y-1">
              {/* Discount Controls - Improved */}
              <div className="p-2 px-3 bg-white shadow rounded-xl">
                <p className="text-lg font-semibold text-gray-700">Discount</p>
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Percentage:</span>
                    <input
                      value={discountPercentage}
                      onChange={(e) => {
                        const discount = Number(e.target.value);
                        if (discount > 100) {
                          toast.error("Discount can't be > 100% !");
                          setDiscountPercentage(100);
                        } else if (discount < 0) {
                          toast.error("Discount can't be < 0% !");
                          setDiscountPercentage(0);
                        } else {
                          setDiscountPercentage(discount);
                        }
                        setDiscountAmount(0);
                      }}
                      onFocus={(e) => e.target.select()}
                      type="number"
                      className="w-24 p-2 px-3 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <span>%</span>
                  </div>
                  <div className="text-gray-300 hidden sm:block">|</div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Amount:</span>
                    <input
                      value={discountAmount}
                      onChange={(e) => {
                        const discount = Number(e.target.value);
                        if (discount > subtotal) {
                          toast.error("Discount can't be > Subtotal !");
                          setDiscountAmount(subtotal);
                        } else if (discount < 0) {
                          toast.error("Discount can't be < 0 !");
                          setDiscountAmount(0);
                        } else {
                          setDiscountAmount(discount);
                        }
                        setDiscountPercentage(0);
                      }}
                      onFocus={(e) => e.target.select()}
                      type="number"
                      className="w-24 p-2 px-3 border border-teal-500 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <span className="ms-1">৳</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary - Improved */}
              <div className="bg-gray-50 rounded-xl p-2 px-3">
                <table className="w-full">
                  <tbody className="space-y-2">
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium text-gray-700">
                        Discount:
                      </td>
                      <td className="py-2 text-right font-semibold text-red-600">
                        - ৳{discount.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium text-gray-700">Total:</td>
                      <td className="py-2 text-right font-bold text-teal-700 text-xl">
                        ৳{totalAfterDiscount.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 font-medium text-gray-700">
                        Paid Amount:
                      </td>
                      <td className="py-2 text-right">
                        <input
                          className="w-32 text-black p-2 px-3 border border-teal-500 rounded-md text-right focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          type="number"
                          min="0"
                          value={paidAmount}
                          onChange={(e) =>
                            setPaidAmount(Number(e.target.value))
                          }
                          onFocus={(e) => e.target.select()}
                        />
                        <span className="ml-1">৳</span>
                      </td>
                    </tr>
                    <tr className="bg-green-50 rounded-lg">
                      <td className="py-2 font-medium text-gray-700">
                        Exchange:
                      </td>
                      <td className="py-2 text-right font-semibold text-green-600">
                        ৳{Math.max(exchange, 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-orange-50 rounded-lg">
                      <td className="py-2 font-medium text-gray-700">Due:</td>
                      <td className="py-2 text-right font-semibold text-orange-600">
                        ৳{dueAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Payment Method - Improved */}
              <div className="mt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="block w-full bg-linear-to-r from-teal-400 to-teal-600 text-black border-0 rounded-lg py-3 px-4 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="Cash">💵 Cash</option>
                  <option value="Card">💳 Card</option>
                  <option value="Online">🏦 Online Banking</option>
                </select>
              </div>

              {/* Save Button - Improved */}
              <div className="pt-4">
                <button
                  onClick={handleCreatBilling}
                  disabled={saving || !selectedPatient || !refBy?.name}
                  className={`
                  w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg
                  transition-all duration-300 ease-in-out transform
                  ${
                    saving || !selectedPatient
                      ? "bg-gray-400 cursor-not-allowed"
                      : `
                        bg-linear-to-r from-teal-600 to-teal-500
                        hover:from-teal-700 hover:to-teal-600
                        hover:shadow-xl active:scale-98
                        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                      `
                  }
                  relative overflow-hidden
                `}
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin size-5" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span className="relative z-10">💾 Save Bill</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden">
        <div>
          <div ref={printRef}>{invoice && <Invoice invoice={invoice} />}</div>
        </div>
      </div>

      {/* create a new patient data */}
      {isOpen && (
        <FixedPop>
          <CreatePatientComponent
            setIsOpen={setIsOpen}
            setNewPatient={setSelectedPatient}
          />
        </FixedPop>
      )}
    </div>
  );
}

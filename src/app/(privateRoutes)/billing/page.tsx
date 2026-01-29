"use client";

import Invoice from "@/components/Invoice/Invoice";
import { CreatePatientComponent } from "@/components/PatientComponents/CreatePatient";
import { envConfig } from "@/config/envConfig";
import { accessToken } from "@/services/AuthServices";
import { IInvoice, IPatient, IServiceItem } from "@/types";
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

  const subtotal = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  }, [selectedServices]);

  const discount = useMemo(() => {
    if (discountPercentage > 0) return (subtotal * discountPercentage) / 100;
    if (discountAmount > 0) return discountAmount;
    return 0;
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

  // create bill function
  const handleCreatBilling = async () => {
    setSaving(true);
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

    if (collectedPaidAmount === 0) {
      toast.error("Paid Amount should not be 0 !");
      setSaving(false);
      return;
    }

    const payload = {
      patientInfo: selectedPatient?._id, // Types.ObjectId;
      pId: selectedPatient?.pId, // string;
      services: selectedServices, // Array<IServiceBill>;
      subTotal: subtotal, // number;
      discount: discount, // number;
      totalAmount: totalAfterDiscount, // number;
      paidAmount: collectedPaidAmount, // number;
      dueAmount: dueAmount, // number;
      paymentStatus: paymentStatus, // (typeof CPaymentStatus)[number];
      paymentMethod: paymentMethod, // (typeof CPaymentMethod)[number];
    };

    const token = await accessToken();

    console.log(payload, token);

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
    <div className="p-2 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-white text-lg font-bold py-1 mb-2 bg-gradient-to-r from-teal-600 to-teal-400 rounded-lg shadow-md">
          Create Bill
        </h2>

        {/* Patient Search Section */}
        <div className="mb-2 bg-white p-2 rounded-lg shadow-sm shadow-purple-500/50">
          <div className="relative">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="col-span-2 border-2 border-teal-400 rounded-lg flex items-center p-2 bg-gray-50 transition-all focus-within:border-teal-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-200">
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
                <Search size={20} className="text-teal-600 ml-2" />
              </div>
              <div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-3 w-full font-bold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  New Patient
                </button>
              </div>
            </div>

            {patients?.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-amber-300 z-10 border border-rose-300 rounded-lg shadow-xl mt-1 overflow-hidden">
                <div className="custom-scroll max-h-64 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-teal-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                          Phone
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {patients?.map((patient, i) => (
                        <tr
                          onClick={() => {
                            setSelectedPatient(patient);
                            setPatients([]);
                          }}
                          key={i}
                          className="hover:bg-teal-50 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-2 text-sm font-medium text-teal-700">
                            {patient?.pId}
                          </td>
                          <td className="px-4 py-2 text-sm text-teal-600">
                            {patient?.fullName}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {patient?.age} Y
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
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

          {/* patient info section */}
          <div className="mt-1 bg-gray-50 rounded-lg p-2 border border-gray-200">
            <h3 className="text-lg font-semibold text-teal-700 mb-1 border-b border-teal-200">
              Patient Information
            </h3>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-2">
                <p className="bg-teal-700 text-white rounded-md p-2 px-4 w-full truncate">
                  PId : {selectedPatient?.pId}
                </p>
              </div>

              <div className="col-span-3">
                <p className="bg-teal-700 text-white rounded-md p-2 px-4 w-full truncate">
                  Name : {selectedPatient?.fullName}
                </p>
              </div>

              <div className="col-span-3">
                <p className="bg-teal-700 text-white rounded-md p-2 px-4 w-full truncate">
                  Mobile : {selectedPatient?.phoneNumber}
                </p>
              </div>

              <div className="col-span-2">
                <p className="bg-teal-700 text-white rounded-md p-2 px-4 w-full truncate">
                  Age : {selectedPatient?.age}
                </p>
              </div>

              <div className="col-span-2">
                <p className="bg-teal-700 text-white rounded-md p-2 px-4 w-full truncate">
                  Gender : {selectedPatient?.gender}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Billing Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-2">
            {/* Billing Details Section */}
            <div className="border border-gray-200 rounded-lg p-2 bg-white">
              <div className="relative pb-1">
                <label className="text-slate-400">
                  Search & Select services
                </label>
                <div className="col-span-2 border-2 border-teal-400 rounded-lg flex items-center p-2 bg-gray-50 transition-all focus-within:border-teal-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-200">
                  <input
                    type="text"
                    placeholder="Search services..."
                    onChange={handleServiceSearch}
                    onBlur={() => {
                      setTimeout(() => {
                        setServices([]);
                      }, 200);
                    }}
                    className="text-gray-700 px-3 focus:outline-none w-full bg-transparent"
                  />
                  <Search size={20} className="text-teal-600 ml-2" />
                </div>

                {services?.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-amber-300 z-10 border border-rose-300 rounded-lg shadow-xl mt-1 overflow-hidden">
                    <div className="custom-scroll max-h-64 overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-teal-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-teal-800 uppercase tracking-wider">
                              price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {services?.map((service, i) => (
                            <tr
                              onClick={() => {
                                setSelectedServices((prev) => {
                                  const exists = prev.some(
                                    (s) => s.serviceCode === service.serviceCode
                                  );

                                  const { _id, ...rest } = service; // remove _id field

                                  if (exists) return prev; // just return existing array

                                  return [...prev, rest]; // add new service
                                });
                              }}
                              key={i}
                              className="hover:bg-teal-50 cursor-pointer transition-colors"
                            >
                              <td className="px-4 py-2 text-sm font-medium text-teal-700">
                                {service?.serviceName}
                              </td>
                              <td className="px-4 py-2 text-sm text-teal-600">
                                {service?.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Services */}
              <div className="min-h-80 mb-4 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-teal-600 p-2">
                  <p className="text-center font-bold text-white">
                    Selected Items
                  </p>
                </div>

                {selectedServices.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No services selected
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {selectedServices?.map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-1 hover:bg-gray-50 transition-colors relative"
                      >
                        <span className="font-medium text-gray-800 flex items-center gap-2">
                          <button
                            onClick={() =>
                              setSelectedServices((prev) =>
                                prev.filter(
                                  (s) => s.serviceCode !== service.serviceCode
                                )
                              )
                            }
                            className="border cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                            title="Remove"
                          >
                            <X size={18} />
                          </button>
                          {service.serviceName}
                        </span>
                        <span className="text-teal-700 font-semibold">
                          {service.price}/=
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subtotal */}
              <div className="text-right mb-4 p-2 bg-gray-50 rounded-lg">
                <span className="font-bold text-lg text-gray-800">
                  Subtotal:
                </span>
                <span className="font-bold text-lg text-teal-700">
                  {subtotal}/=
                </span>
              </div>
            </div>

            <div>
              {/* Discount Controls */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg flex text-slate-500 justify-between items-center border-t">
                <p className="text-lg">Discount:</p>
                <div>
                  <span>Percentage:</span>
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
                    className="w-20 p-1 px-2 border border-teal-500 rounded-lg ms-1"
                  />
                  <span>%</span>
                </div>
                <span className="text-gray-400">|</span>

                <div>
                  <span>Amount:</span>
                  <input
                    value={discountAmount}
                    onChange={(e) => {
                      const discount = Number(e.target.value);
                      if (discount > subtotal) {
                        toast.error("Discount can't be > 100% !");
                        setDiscountAmount(0);
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
                    className="w-20 p-1 px-2 border border-teal-500 rounded-lg ms-1"
                  />
                  <span className="ms-1">/=</span>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 font-medium text-gray-700">
                        Discount:
                      </td>
                      <td className="py-2 text-right font-semibold text-red-600">
                        {discount.toFixed(2)}/=
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-gray-700">Total:</td>
                      <td className="py-2 text-right font-bold text-teal-700">
                        {totalAfterDiscount.toFixed(2)}/=
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-gray-700">
                        Paid Amount:
                      </td>
                      <td className="py-2 text-right">
                        <input
                          className="w-32 text-black p-1 px-2 border border-teal-500 rounded-md text-right"
                          type="number"
                          min="0"
                          value={paidAmount}
                          onChange={(e) =>
                            setPaidAmount(Number(e.target.value))
                          }
                          onFocus={(e) => e.target.select()}
                        />
                        <span className="ml-1">/=</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-gray-700">
                        Exchange:
                      </td>
                      <td className="py-2 text-right font-semibold text-gray-600">
                        {Math.max(exchange, 0).toFixed(2)}/=
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-gray-700">Due:</td>
                      <td className="py-2 text-right font-semibold text-orange-600">
                        {dueAmount.toFixed(2)}/=
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="block w-full bg-teal-700 text-white border-0 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online Banking</option>
                </select>
              </div>

              {paymentStatus && (
                <div className="mt-4 p-2 text-center text-lg font-medium rounded-md bg-teal-100 text-teal-800">
                  {paymentStatus}
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleCreatBilling}
                  disabled={saving || !selectedPatient}
                  className={`
                            w-full py-3 px-6 rounded-lg font-bold text-white shadow-md
                            transition-all duration-300 ease-in-out transform
                            ${
                              saving || !selectedPatient
                                ? "bg-gray-400 cursor-not-allowed"
                                : `
                                bg-gradient-to-r from-teal-600 to-teal-500
                                hover:from-teal-700 hover:to-teal-600
                                active:scale-[0.98] hover:shadow-lg
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
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
                    <span className="relative z-10">Save Bill</span>
                  )}

                  {/* Animated background for enabled state */}
                  {!(saving || !selectedPatient) && (
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-700 to-teal-600 opacity-0 hover:opacity-100 transition-opacity duration-300 z-0"></span>
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
        <CreatePatientComponent
          setIsOpen={setIsOpen}
          setNewPatient={setSelectedPatient}
        />
      )}
    </div>
  );
}

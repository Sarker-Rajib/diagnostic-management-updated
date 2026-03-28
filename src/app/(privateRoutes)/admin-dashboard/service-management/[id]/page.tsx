"use client";
import { envConfig } from "@/config/envConfig";
import { accessToken } from "@/services/AuthServices";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { constants } from "@/constants";
import { IServiceData } from "@/types";

export default function ServiceUpdatePage({}) {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  //
  const [reload, setReload] = useState<boolean>(false);
  const [accToken, setAcctoken] = useState<string>("");
  const [service, setService] = useState<IServiceData>();
  const [formData, setFormData] = useState<Partial<IServiceData>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${envConfig.baseApi}/services/${id}`);
        const data = await response.json();
        const serviceData = data.data?.[0];
        if (serviceData) {
          setService(serviceData);
          setFormData(serviceData); // prefill form with current data
        }

        const token = await accessToken();
        if (token) setAcctoken(token);
      } catch (error) {
        console.error("Error fetching:", error);
        toast.error("Error fetching service data");
      }
    };

    if (id) fetchData();
  }, [reload]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can send formData to your API here services/create

    try {
      const response = await fetch(
        `${envConfig.baseApi}/services/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: accToken,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Service Updated successfully");
        setReload(!reload);
      } else {
        toast.error(`Error creating Service: ${data?.message}`);
      }
    } catch (error) {
      console.error("Error creating Service:", error);
      toast.error("Error creating Service");
    }
  };

  return (
    <div className="p-2 relative max-w-2xl bg-white/60 mx-auto bg- rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
      <form onSubmit={handleUpdate} className="p-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-teal-600">
            Service Data : {service?.serviceCode}
          </h2>
          <Link
            href="/admin-dashboard/service-management"
            className="flex border pe-2 rounded text-amber-600"
          >
            <ChevronLeft /> Back
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-teal-600 block text-sm font-medium">
              Service Name
            </label>
            <input
              name="serviceName"
              type="text"
              defaultValue={service?.serviceName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  serviceName: e.target.value,
                })
              }
              className="mt-1 w-full border border-sky-500 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-teal-600 block text-sm font-medium">
              Test Name
            </label>
            <input
              name="testName"
              type="text"
              defaultValue={service?.refName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  refName: e.target.value,
                })
              }
              className="mt-1 w-full border border-sky-500 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="text-teal-600 block text-sm font-medium">
              Price
            </label>

            <input
              type="number"
              step="0.01"
              name="price"
              defaultValue={service?.price}
              onFocus={(e) => e.target.select()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(e.target.value),
                })
              }
              className="mt-1 w-full border border-sky-500 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-teal-600 block text-sm font-medium">
              Division
            </label>

            <select
              name="division"
              value={service?.division}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  division: e.target.value,
                });
                setService({
                  ...service!,
                  division: e.target.value,
                });
              }}
              className="mt-1 w-full border border-sky-500 rounded px-3 py-2"
              required
            >
              {constants.division.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-teal-600 block text-sm font-medium">
              Department
            </label>

            <select
              name="department"
              value={service?.department}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  department: e.target.value,
                });
                setService({
                  ...service!,
                  department: e.target.value,
                });
              }}
              className="mt-1 w-full border border-sky-500 rounded px-3 py-2"
              required
            >
              {constants.department.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Report Group</label>
            <select
              name="reportGroup"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  reportGroup: e.target.value,
                });
                setService({
                  ...service!,
                  reportGroup: e.target.value,
                });
              }}
              value={service?.reportGroup}
              className="mt-1 w-full border border-sky-500 rounded px-3 py-2"
              required
            >
              {constants.reportGroup.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Panel</label>

            <div className="mt-1 flex gap-4 border border-sky-500 p-1.5 rounded">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="panel"
                  checked={service?.panel === true}
                  onChange={() => {
                    (setFormData({
                      ...formData,
                      panel: true,
                    }),
                      setService({
                        ...service!,
                        panel: true,
                      }));
                  }}
                />
                Yes
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="panel"
                  checked={service?.panel === false}
                  onChange={() => {
                    (setFormData({
                      ...formData,
                      panel: false,
                    }),
                      setService({
                        ...service!,
                        panel: false,
                      }));
                  }}
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="text-teal-600 block text-sm font-medium">
              Specimen Type
            </label>
            <select
              name="testSample"
              value={service?.testSample}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  testSample: e.target.value,
                });
                setService({
                  ...service!,
                  testSample: e.target.value,
                });
              }}
              className="mt-1 w-full border border-sky-500 rounded px-3 py-2"
              required
            >
              {constants.testSample.map((grp) => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-end pt-3">
          <button
            type="submit"
            className="bg-teal-700 text-white px-16 py-2 rounded-xl hover:bg-teal-700 transition cursor-pointer"
          >
            Save Service Data
          </button>
        </div>
      </form>
    </div>
  );
}

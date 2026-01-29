"use client";
import { envConfig } from "@/config/envConfig";
import { accessToken } from "@/services/AuthServices";
import { Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { toast } from "sonner";

interface IService {
  _id: string;
  name: string;
  price: number;
}

export const ServiceItems = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [realoader, setRealoader] = useState(false);
  const [services, setServices] = useState<IService[]>();

  const [updateService, setUpdateService] = useState<IService | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // const data = await fetch("/service/all");

      setServices([]);
    };

    loadData();
  }, [realoader]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.sName.value;
    const price = Number(form.price.value);

    if (!name || !price) {
      toast.error("Please enter data.");
      return;
    }

    setIsLoadingEdit(true);

    const token = await accessToken();
    const payload = { name, price };

    fetch(`${envConfig.baseApi}/service/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success) {
          toast.success(`${data?.message}`);
          setRealoader(!realoader);
          form.reset();
        } else {
          toast.error(`${data?.message}`);
        }
      })
      .catch((error) => {
        toast.error(`${error?.message}`);
      });
    setIsLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.sName.value;
    const price = Number(form.price.value);

    if (!name || !price) {
      toast.error("Please enter data.");
      return;
    }

    setIsLoadingEdit(true);

    const token = await accessToken();
    const payload = { name, price };

    fetch(`${envConfig.baseApi}/service/update/${updateService?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.success) {
          toast.success(`${data?.message}`);
          setRealoader(!realoader);
          setUpdateService(null);
        } else {
          toast.error(`${data?.message}`);
        }
      })
      .catch((error) => {
        toast.error(`${error?.message}`);
      });
    setIsLoadingEdit(false);
  };

  return (
    <div className="px-4 py-6 bg-white text-black rounded-lg">
      <h2 className="text-xl text-center mb-2">Service List</h2>
      <div className="border rounded-lg p-4 mb-2">
        <h3>Add a service</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="sName"
            className="border mb-2 rounded-lg w-full p-2"
            type="text"
            placeholder="Service Name"
          />
          <input
            name="price"
            className="border mb-2 rounded-lg w-full p-2"
            type="number"
            placeholder="Price"
          />
          <button
            disabled={isLoading}
            className="bg-teal-500 p-1 px-12 rounded text-white"
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
      <div className="border rounded-lg p-4">
        <p className="mb-2 text-center text-lg">
          Manage your clinical conditions here.
        </p>
        {services ? (
          <div>
            {services.length === 0 ? (
              <p className="text-center text-gray-500">
                No data found. Please add some.
              </p>
            ) : (
              <div>
                {services.map((serv, i) => (
                  <p
                    key={i}
                    className={`p-1 pe-10 ${
                      i % 2 == 0 && "bg-slate-200"
                    }  hover:bg-sky-300 hover:text-white relative`}
                  >
                    <span className="flex justify-between items-center">
                      <span>{serv.name}</span>
                      <span>{serv.price} BDT</span>
                    </span>
                    <button
                      onClick={() => setUpdateService(serv)}
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      <Edit size={22} />
                    </button>
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="py-3">
              <PropagateLoader color="#a835ca" />
            </div>
          </div>
        )}

        {updateService && (
          <div className="rounded-lg p-4 fixed top-0 left-0 w-full min-h-screen bg-transparent backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-full max-w-[550px] relative p-4 py-6 bg-white border rounded-lg border-teal-500">
              <p className="py-2 text-center text-xl">Upadate Service</p>
              <button
                onClick={() => setUpdateService(null)}
                className="bg-amber-500 p-1 rounded text-white absolute right-2 top-2"
              >
                <X />
              </button>
              <form onSubmit={handleUpdate}>
                <input
                  name="sName"
                  className="border mb-2 rounded-lg w-full p-2"
                  type="text"
                  defaultValue={updateService.name}
                />
                <input
                  name="price"
                  className="border mb-2 rounded-lg w-full p-2"
                  type="number"
                  defaultValue={updateService.price}
                />

                <div className="text-end pt-2">
                  <button
                    disabled={isLoading}
                    className="bg-teal-500 p-2 px-12 rounded text-white"
                  >
                    {isLoadingEdit ? "Loading..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

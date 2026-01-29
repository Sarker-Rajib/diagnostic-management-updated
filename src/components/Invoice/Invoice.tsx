import { IInvoice } from "@/types";

const Invoice = ({ invoice }: { invoice: IInvoice }) => {
  return (
    <div className="hidden print:block print:p-8 print:bg-white text-black">
      {invoice && (
        <div className="max-w-[800px] mx-auto border border-gray-300 p-6 text-sm font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-teal-700">
                Dental Chamber
              </h1>
              <p className="text-xs text-gray-600">Address line, City, ZIP</p>
              <p className="text-xs text-gray-600">Phone: 01234567890</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-sm">#{invoice.billId}</p>
              <p className="text-xs text-gray-500">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <p>
                <strong>Name:</strong> {invoice.patientInfo.fullName}
              </p>
              <p>
                <strong>Patient ID:</strong> {invoice.patientInfo.pId}
              </p>
              <p>
                <strong>Age:</strong> {invoice.patientInfo.age} years
              </p>
              <p>
                <strong>Phone:</strong> {invoice.patientInfo.phoneNumber}
              </p>
            </div>
          </div>

          {/* Services Table */}
          <table className="w-full border border-collapse mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">#</th>
                <th className="border px-2 py-1 text-left">Service</th>
                <th className="border px-2 py-1 text-right">Price (৳)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.services.map((s, i) => (
                <tr key={s._id}>
                  <td className="border px-2 py-1">{i + 1}</td>
                  <td className="border px-2 py-1">{s.serviceName}</td>
                  <td className="border px-2 py-1 text-right">
                    {s.price.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Payment Method:</strong> {invoice.paymentMethod}
              </p>
              <p className="flex items-center">
                <strong>Payment Status:</strong>
                <span className="text-xl ps-2">{invoice.paymentStatus}</span>
              </p>
            </div>
            <div>
              <div className="text-right text-sm space-y-1 mb-4">
                <p>
                  <strong>Subtotal:</strong> ৳
                  {invoice.subTotal.toLocaleString()}
                </p>
                <p>
                  <strong>Discount:</strong> -৳
                  {invoice.discount.toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong>
                  <span className="font-semibold">
                    ৳{invoice.totalAmount.toLocaleString()}
                  </span>
                </p>
                <p>
                  <strong>Paid:</strong> ৳{invoice.paidAmount.toLocaleString()}
                </p>
                <p>
                  <strong>Due:</strong> ৳{invoice.dueAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm mt-8">
            <p>
              <strong>Billed By:</strong> {invoice.billedBy.fullName} (
              {invoice.billedBy.username})
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This is a system-generated invoice. No signature required.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;

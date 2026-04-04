import React from "react";

const LabReportPrint = ({
  serviceTitle,
  patientInfo,
  testList,
  testResults,
}: any) => {
  const patient = patientInfo;

  function checkAbnormal(value: string, referenceRange: string) {
    if (!value || !referenceRange) return false;

    const match = referenceRange.match(/[\d.]+/g);
    if (match && match.length >= 2) {
      const low = parseFloat(match[0]);
      const high = parseFloat(match[1]);
      const numValue = parseFloat(value);

      if (!isNaN(numValue)) {
        return numValue < low || numValue > high;
      }
    }
    return false;
  }

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white">
      {/* Paper */}
      <div
        className="px-4 bg-white shadow-xl print:shadow-none relative rounded-lg overflow-hidden"
        style={{
          width: "8.4in",
          height: "11.2in",
        }}
      >
        <div style={{ paddingBottom: "1.2in" }}></div>

        {/* Patient Info Card */}
        <div className="px-6">
          <div className="flex justify-between gap-6 text-sm bg-linear-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="space-y-1">
              <p className="flex items-baseline">
                <span className=" w-16 font-medium">Name</span>
                <span className=" font-semibold">: {patient?.fullName}</span>
              </p>
              <p className="flex items-baseline">
                <span className=" w-16 font-medium">Age</span>
                <span className="">: {patient?.age} years</span>
              </p>
              <p className="flex items-baseline">
                <span className=" w-16 font-medium">Gender</span>
                <span className="">: {patient?.gender}</span>
              </p>
              <p className="flex items-baseline">
                <span className=" w-16 font-medium whitespace-nowrap">
                  Ref By
                </span>
                <span className="">: {patient?.refBy?.name}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-baseline">
                <span className=" w-12 font-medium">ID</span>
                <span className=" font-mono text-sm">: {patient?.pId}</span>
              </p>
              <p className="flex items-baseline">
                <span className=" w-12 font-medium">Phone</span>
                <span className="">: {patient?.phoneNumber}</span>
              </p>
              <p className="flex items-baseline">
                <span className=" w-12 font-medium">Date</span>
                <span className="">
                  :{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="p-4 px-6">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide  border-b-2 border-blue-400 inline-block px-6 pb-1">
              {serviceTitle}
            </h2>
          </div>

          {/* Content */}
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Result
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {testList?.map((item: any, i: number) => {
                if (item?.isPanel) {
                  return (
                    <React.Fragment key={i}>
                      {/* Panel Header */}
                      <tr className="bg-gray-50/30">
                        <td
                          colSpan={4}
                          className="px-4 py-1 text-sm font-semibold "
                        >
                          {item?.panelName}
                        </td>
                      </tr>

                      {/* Panel Tests */}
                      {item?.tests.map((test: any) => {
                        const resultValue = testResults[test?.refName];
                        const isAbnormal = checkAbnormal(
                          resultValue,
                          test?.referenceRange,
                        );

                        return (
                          <tr
                            key={`test-${test._id}`}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-1 pl-8 text-sm ">
                              {test?.testName}
                            </td>
                            <td
                              className={`px-4 py-1 text-sm font-mono ${isAbnormal ? "text-amber-600 font-medium" : ""}`}
                            >
                              {resultValue || "—"}
                            </td>
                            <td className="px-4 py-1 text-sm ">
                              {test?.unit || "—"}
                            </td>
                            <td className="px-4 py-1 text-sm  whitespace-pre-line">
                              {test?.referenceRange || "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                }

                // Single test (non-panel)
                const resultValue = testResults[item?.refName];
                const isAbnormal = checkAbnormal(
                  resultValue,
                  item?.referenceRange,
                );

                return (
                  <tr
                    key={item?._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-1 text-sm ">{item?.testName}</td>
                    <td
                      className={`px-4 py-1 text-sm font-mono ${isAbnormal ? "text-amber-600 font-medium" : ""}`}
                    >
                      {resultValue || "—"}
                    </td>
                    <td className="px-4 py-1 text-sm ">{item?.unit || "—"}</td>
                    <td className="px-4 py-1 text-sm  whitespace-pre-line">
                      {item?.referenceRange || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 absolute left-0 bottom-0 w-full">
          <div className="border-t border-gray-200 pt-4 pb-6">
            <div className="flex justify-between items-end text-xs">
              <div className="flex-1">
                <p className=" font-medium mb-2">Checked By</p>
                <div className="w-40 border-b border-gray-300"></div>
                <p className=" mt-1 text-[10px]">(Doctor's Name & Stamp)</p>
              </div>

              <div className="flex-1 text-right">
                <p className=" font-medium mb-2">Authorized Signature</p>
                <div className="w-40 border-b border-gray-300 ml-auto"></div>
                <p className=" mt-1 text-[10px]">(Hospital Stamp)</p>
              </div>
            </div>

            {/* Optional: Footer note */}
            <div className="text-center mt-4 pt-2 border-t border-gray-100">
              <p className=" text-[8px]">
                This is a computer-generated document. No signature is required
                for electronic copy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportPrint;

import { constants } from "@/constants";
import React from "react";

const LabReportPrint = ({
  serviceTitle,
  patientInfo,
  testList,
  testResults,
}: any) => {
  const patient = patientInfo;
  const departmetName = constants?.reportSampleDepartment?.find(
    (r) => r.name === serviceTitle,
  );

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

  const maskPhone = (phone: string) => {
    if (!phone || phone.length !== 11) return phone;

    return phone.slice(0, 3) + "***" + phone.slice(6);
  };

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
            <table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td className="px-2">:</td>
                  <td>{patient?.fullName}</td>
                </tr>
                <tr>
                  <td>Age</td>
                  <td className="px-2">:</td>
                  <td>
                    {patient?.age} years / {patient?.gender}
                  </td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td className="px-2">:</td>
                  <td>{maskPhone(patient?.phoneNumber)}</td>
                </tr>
                <tr>
                  <td>Ref By</td>
                  <td className="px-2">:</td>
                  <td>{patient?.refBy?.name}</td>
                </tr>
              </tbody>
            </table>

            <table>
              <tbody>
                <tr>
                  <td>MR ID</td>
                  <td className="px-2">:</td>
                  <td>B260000--</td>
                </tr>
                <tr>
                  <td>PT ID</td>
                  <td className="px-2">:</td>
                  <td>{patient?.pId}</td>
                </tr>
                <tr>
                  <td>Sample</td>
                  <td className="px-2">:</td>
                  <td>{departmetName?.sample}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td className="px-2">:</td>
                  <td>
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* body */}
        <div className="p-4 px-6">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide  border-b-2 border-blue-400 inline-block px-6 pb-1">
              {departmetName?.department} Report
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
                          className="px-4 py-px text-sm font-semibold "
                        >
                          {item?.panelName}
                        </td>
                      </tr>

                      {/* Panel Tests */}
                      {item?.tests.map((test: any, i: number) => {
                        const resultValue = testResults[test?.refName];
                        const isAbnormal = checkAbnormal(
                          resultValue,
                          test?.referenceRange,
                        );

                        return (
                          <tr
                            key={i}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-px pl-8 text-sm align-top">
                              {test?.testName}
                            </td>

                            <td
                              className={`px-4 py-px text-sm font-mono align-top ${
                                isAbnormal ? "text-amber-600 font-medium" : ""
                              }`}
                            >
                              {resultValue || "—"}
                            </td>

                            <td className="px-4 py-px text-sm align-top">
                              {test?.unit || "—"}
                            </td>

                            <td className="px-4 py-px text-sm whitespace-pre-line align-top">
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
                    <td className="align-top px-4 py-1 text-sm ">
                      {item?.testName}
                    </td>
                    <td
                      className={`align-top px-4 py-1 text-sm font-mono ${isAbnormal ? "text-amber-600 font-medium" : ""}`}
                    >
                      {resultValue || "—"}
                    </td>
                    <td className="align-top px-4 py-1 text-sm ">
                      {item?.unit || "—"}
                    </td>
                    <td className="align-top px-4 py-1 text-sm  whitespace-pre-line">
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
                <p className=" mt-1 text-[10px]">(Medical Technologist)</p>
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
                This is a computer-generated document.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReportPrint;

import { useRef } from "react";
import { ITestPanelFull, ITestRefData } from "@/types";

export type TData = ITestRefData | ITestPanelFull;

const LabTable = ({ data }: { data: TData[] }) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  let inputIndex = 0; // track index manually

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus(); // move to next
    }
  };

  return (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr>
          <th className="border px-4 py-2">Test Name</th>
          <th className="border px-4 py-2">Result</th>
          <th className="border px-4 py-2">Unit</th>
          <th className="border px-4 py-2">Reference</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item: any) => {
          if (item.isPanel) {
            return (
              <>
                {/* Panel Header */}
                <tr key={item._id} className="bg-blue-100">
                  <td colSpan={4} className="border px-4 py-2">
                    {item.panelName}
                  </td>
                </tr>

                {/* Panel Tests */}
                {item.tests.map((test: any) => {
                  const currentIndex = inputIndex++;

                  return (
                    <tr key={test._id}>
                      <td className="border px-4 py-2">{test.testName}</td>

                      <td className="border px-4 py-2">
                        <input
                          ref={(el) => {
                            if (el) inputRefs.current[currentIndex] = el;
                          }}
                          onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                          className="w-full border px-2 py-1"
                        />
                      </td>

                      <td className="border px-4 py-2">{test.unit}</td>

                      <td className="border px-4 py-2 whitespace-pre-line">
                        {test.referenceRange}
                      </td>
                    </tr>
                  );
                })}
              </>
            );
          }

          // Single Test
          const currentIndex = inputIndex++;

          return (
            <tr key={item._id}>
              <td className="border px-4 py-2">{item.testName}</td>

              <td className="border px-4 py-2">
                <input
                  ref={(el) => {
                    if (el) inputRefs.current[currentIndex] = el;
                  }}
                  onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                  className="w-full border px-2 py-1"
                />
              </td>

              <td className="border px-4 py-2">{item.unit}</td>

              <td className="border px-4 py-2 whitespace-pre-line">
                {item.referenceRange}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LabTable;

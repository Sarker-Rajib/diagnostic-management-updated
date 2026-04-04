"use client";
import React, { useRef } from "react";
import { ITestPanelFull, ITestRefData, TResultMap } from "@/types";

export type TData = ITestRefData | ITestPanelFull;

const LabTable = ({
  data,
  results,
  setResults,
}: {
  data: TData[];
  results: TResultMap;
  setResults: React.Dispatch<React.SetStateAction<TResultMap>>;
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (name: string, value: string) => {
    setResults((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle input move
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
          <th className="border px-2 py-0.5">Test Name</th>
          <th className="border px-2 py-0.5">Result</th>
          <th className="border px-2 py-0.5">Unit</th>
          <th className="border px-2 py-0.5">Reference</th>
        </tr>
      </thead>

      <tbody>
        {data?.map((item: any, i: number) => {
          if (item?.isPanel) {
            return (
              <React.Fragment key={i}>
                {/* Panel Header */}
                <tr className="bg-blue-100">
                  <td colSpan={4} className="border px-2 py-0.5 font-bold">
                    {item?.panelName}
                  </td>
                </tr>

                {/* Panel Tests */}
                {item?.tests.map((test: any, i: number) => {
                  const currentIndex = inputIndex++;

                  return (
                    <tr key={i}>
                      <td className="ps-4 border px-2 py-0.5">
                        {test?.testName}
                      </td>

                      <td className="border px-2 py-0.5">
                        <input
                          ref={(el) => {
                            if (el) inputRefs.current[currentIndex] = el;
                          }}
                          name={test?.refName}
                          value={results[test?.refName] || ""}
                          onChange={(e) =>
                            handleChange(test?.refName, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                          className="w-full border px-2 py-1 rounded-lg"
                        />
                      </td>

                      <td className="border px-2 py-0.5">{test?.unit}</td>

                      <td className="border px-2 py-0.5 whitespace-pre-line">
                        {test?.referenceRange}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          }

          // Single Test
          const currentIndex = inputIndex++;

          return (
            <tr key={item?._id}>
              <td className="border px-2 py-0.5">{item?.testName}</td>

              <td className="border px-2 py-0.5">
                <input
                  ref={(el) => {
                    if (el) inputRefs.current[currentIndex] = el;
                  }}
                  name={item.refName}
                  value={results[item.refName] || ""}
                  onChange={(e) => handleChange(item.refName, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, currentIndex)}
                  className="w-full border px-2 py-1 rounded-lg"
                />
              </td>

              <td className="border px-2 py-0.5">{item?.unit}</td>

              <td className="border px-2 py-0.5 whitespace-pre-line">
                {item?.referenceRange}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default LabTable;

const UsgReportPrint = ({ serviceTitle, patientInfo, currentData }: any) => {
  const patient = patientInfo;

  //   return (
  //     <div className="flex justify-center print:bg-white">
  //       {/* Paper */}
  //       <div
  //         className="bg-white shadow print:shadow-none relative px-6"
  //         style={{
  //           width: "8.4in",
  //           height: "11.2in",
  //         }}
  //       >
  //         <div style={{ paddingBottom: "1.7in" }}></div>
  //         {/* Inner Content Padding */}
  //         {/* Patient Info */}
  //         <div className="grid grid-cols-2 gap-4 text-xs mt-4 border p-2">
  //           <div>
  //             <p>
  //               <b>Name:</b> {patient?.fullName}
  //             </p>
  //             <p>
  //               <b>Age:</b> {patient?.age}
  //             </p>
  //             <p>
  //               <b>Gender:</b> {patient?.gender}
  //             </p>
  //           </div>
  //           <div>
  //             <p>
  //               <b>ID:</b> {patient?.pId}
  //             </p>
  //             <p>
  //               <b>Phone:</b> {patient?.phoneNumber}
  //             </p>
  //             <p>
  //               <b>Date:</b> {new Date().toLocaleDateString()}
  //             </p>
  //           </div>
  //         </div>

  //         <div className="py-4 flex flex-col justify-between">
  //           {/* Body */}
  //           {/* Title */}
  //           <div className="text-center mt-3">
  //             <h2 className="text-lg font-semibold uppercase border-b inline-block px-4">
  //               {serviceTitle}
  //             </h2>
  //           </div>
  //           <div className="flex-1 overflow-hidden">
  //             <div
  //               className="prose max-w-none text-xs
  //                          [&_p]:mb-1
  //                          [&_ul]:list-disc [&_ul]:ml-4
  //                          [&_li]:mb-1"
  //               dangerouslySetInnerHTML={{ __html: currentData }}
  //             />
  //           </div>
  //         </div>

  //         <div className="px-6 absolute left-0 bottom-0 w-full">
  //           <div style={{ paddingBottom: "0.7in" }} className="relative">
  //             <div className="flex justify-between text-xs">
  //               <div>
  //                 <p>Checked By</p>
  //                 <div className="mt-6 border-t w-32"></div>
  //               </div>

  //               <div className="text-right">
  //                 <p>Authorized Signature</p>
  //                 <div className="mt-6 border-t w-32 ml-auto"></div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="flex justify-center bg-gray-100 print:bg-white">
      {/* Paper */}
      <div
        className="bg-white shadow-xl print:shadow-none relative rounded-lg overflow-hidden p-4"
        style={{
          width: "8.4in",
          height: "11.2in",
        }}
      >
        <div style={{ paddingBottom: "1.2in" }}></div>

        {/* Inner Content Padding */}
        {/* Patient Info Card */}
        <div className="px-6">
          <div className="grid grid-cols-2 gap-6 text-sm bg-linear-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="space-y-1.5">
              <p className="flex items-baseline">
                <span className="text-gray-600 w-16 font-medium">Name:</span>
                <span className="text-gray-800 font-semibold">
                  {patient?.fullName}
                </span>
              </p>
              <p className="flex items-baseline">
                <span className="text-gray-600 w-16 font-medium">Age:</span>
                <span className="text-gray-800">{patient?.age} years</span>
              </p>
              <p className="flex items-baseline">
                <span className="text-gray-600 w-16 font-medium">Gender:</span>
                <span className="text-gray-800">{patient?.gender}</span>
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="flex items-baseline justify-end">
                <span className="text-gray-600 w-12 font-medium">ID:</span>
                <span className="text-gray-800 font-mono text-sm">
                  {patient?.pId}
                </span>
              </p>
              <p className="flex items-baseline justify-end">
                <span className="text-gray-600 w-12 font-medium">Phone:</span>
                <span className="text-gray-800">{patient?.phoneNumber}</span>
              </p>
              <p className="flex items-baseline justify-end">
                <span className="text-gray-600 w-12 font-medium">Date:</span>
                <span className="text-gray-800">
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

        <div className="py-6 flex flex-col justify-between h-[calc(100%-7rem)]">
          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold uppercase tracking-wide text-gray-700 border-b-2 border-blue-400 inline-block px-6 pb-1">
              {serviceTitle}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <div
              className="prose max-w-none text-sm leading-relaxed text-gray-700
                       [&_p]:mb-2 [&_p]:leading-relaxed
                       [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1
                       [&_li]:mb-1
                       [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2
                       [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2
                       [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1
                       [&_strong]:text-gray-900 [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: currentData }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 absolute left-0 bottom-0 w-full">
          <div className="border-t border-gray-200 pt-4 pb-6">
            <div className="flex justify-between items-end text-xs">
              <div className="flex-1">
                <p className="text-gray-500 font-medium mb-2">Checked By</p>
                <div className="w-40 border-b border-gray-300"></div>
                <p className="text-gray-400 mt-1 text-[10px]">
                  (Doctor's Name & Stamp)
                </p>
              </div>

              <div className="flex-1 text-right">
                <p className="text-gray-500 font-medium mb-2">
                  Authorized Signature
                </p>
                <div className="w-40 border-b border-gray-300 ml-auto"></div>
                <p className="text-gray-400 mt-1 text-[10px]">
                  (Hospital Stamp)
                </p>
              </div>
            </div>

            {/* Optional: Footer note */}
            <div className="text-center mt-4 pt-2 border-t border-gray-100">
              <p className="text-gray-400 text-[8px]">
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

export default UsgReportPrint;

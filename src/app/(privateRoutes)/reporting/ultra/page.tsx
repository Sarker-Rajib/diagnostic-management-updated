"use client";
import TiptapEditor from "@/components/TextEditor";
import { Controller, useForm } from "react-hook-form";

export default function UltrasonographyReportPage() {
  const cont = `<p><em>Hi,</em></p><p><em>This is </em>the test Text</p><p><strong>I Hope you Understand</strong></p><p></p>`;
  const { control, handleSubmit } = useForm({
    defaultValues: {
      Details: cont,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data); // all form values
  };

  return (
    <div className="p-2 border border-purple-600 min-h-screen">
      <div className="grid grid-cols-3">
        <div>
          <label>Input Bill id</label>
          <input
            type="number"
            name="billID"
            // value={patient.email}
            // onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            placeholder="bill id"
          />
        </div>
      </div>
      {/* ----- */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="Details"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <div>
                <TiptapEditor content={field.value} onChange={field.onChange} />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            );
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

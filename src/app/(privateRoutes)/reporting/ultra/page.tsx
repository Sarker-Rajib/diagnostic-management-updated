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
    <div>
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
      {/* ----- */}
      <div className="min-h-screen bg-linear-to-br from-teal-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2 text-teal-900">
              Ultra report
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

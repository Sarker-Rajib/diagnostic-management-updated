"use client";

interface Props {
  progress: number;
}

export default function BillingProgressBar({ progress }: Props) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Billing Progress</span>
        <span className="font-semibold text-teal-600">{progress}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div
          className={`h-1 rounded-full transition-all duration-500 ${
            progress < 40
              ? "bg-red-500"
              : progress < 80
                ? "bg-yellow-500"
                : "bg-green-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { getTables } from "@/lib/api";

export default function TableGrid({ active, onPick }: any) {
  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables
  });

  if (isLoading) return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Select Table</h3>
        <span className="text-sm text-gray-500">{tables.length} tables available</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {tables.map((t: any) => {
          const isActive = active?.TableID === t.TableID;
          const isFree = t.TableStatus === "free";

          return (
            <div
              key={t.TableID}
              onClick={() => onPick(t)}
              className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 hover:scale-105 ${
                isActive 
                  ? "border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105" 
                  : isFree
                  ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                  isActive ? "bg-blue-600 text-white" : isFree ? "bg-gray-100 text-gray-700" : "bg-orange-100 text-orange-700"
                }`}>
                  {t.TableID}
                </div>
                <p className={`text-xs font-semibold capitalize ${
                  isActive ? "text-blue-700" : isFree ? "text-gray-600" : "text-orange-600"
                }`}>
                  {t.TableStatus}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

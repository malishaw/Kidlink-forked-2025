"use client";

import { useGetNurseries } from "@/features/nursery/actions/get-nursery-action";

export default function AdminNurseryPage() {
  const { data: nurseries, isLoading, isError, error } = useGetNurseries();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Nurseries</h1>

      {isLoading ? (
        <div>Loading nurseries…</div>
      ) : isError ? (
        <div className="text-red-600">Error: {String(error)}</div>
      ) : !nurseries || nurseries.length === 0 ? (
        <div>No nurseries found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Address
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Phones
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nurseries.map((n) => (
                <tr key={n.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{n.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {n.address ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {(n.phoneNumbers || []).filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

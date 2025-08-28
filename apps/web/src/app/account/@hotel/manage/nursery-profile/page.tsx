// app/account/nurseries/page.tsx
"use client";

import { useGetNurseries } from "@/app/account/actions/get-nursery-action";
import Link from "next/link";

export default function NurseriesPage() {
  const { data, isLoading, isError, error, refetch } = useGetNurseries();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Nurseries</h1>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Nurseries</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded">
          {(error as Error)?.message || "Failed to load nurseries"}
        </div>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const nurseries = data ?? [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nurseries</h1>
        <Link
          href="/account/create-nursery"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create Nursery
        </Link>
      </div>

      {nurseries.length === 0 ? (
        <div className="text-gray-600">No nurseries found.</div>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {nurseries.map((n) => (
            <li key={n.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-start gap-3">
                {n.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={n.logo}
                    alt={n.title}
                    className="w-14 h-14 rounded object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded bg-gray-100 border" />
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{n.title}</h2>
                  {n.address && (
                    <p className="text-sm text-gray-600">{n.address}</p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    <span>Created: {n.createdAt || "—"}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/account/nurseries/${n.id}`}
                      className="text-blue-600 text-sm"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </div>

              {n.description && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                  {n.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

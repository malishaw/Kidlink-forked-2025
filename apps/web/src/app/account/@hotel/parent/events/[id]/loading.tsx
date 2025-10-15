export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        {/* Navigation skeleton */}
        <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>

        {/* Main card skeleton */}
        <div className="bg-white rounded-lg border shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 bg-gray-200 rounded w-16"></div>
                <div className="h-9 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-48"></div>
                </div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>

            <div>
              <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="h-6 bg-gray-200 rounded w-16 mb-3"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-9 w-56 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="h-5 w-96 max-w-full bg-gray-100 rounded animate-pulse mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 space-y-4">
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

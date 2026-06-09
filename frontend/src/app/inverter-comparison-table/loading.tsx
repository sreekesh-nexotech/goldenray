export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#074A4D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading comparison...</p>
      </div>
    </div>
  );
}

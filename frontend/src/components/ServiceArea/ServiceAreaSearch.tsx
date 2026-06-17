import { Search, MapPin, Sun, ChevronDown } from "lucide-react";

export default function ServiceAreaSearch() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 -mt-4 md:-mt-6 pb-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-5 md:p-8">
        {/* Search input */}
        <div className="flex items-center gap-3 w-full bg-[#F5F6F7] rounded-xl px-4 py-3.5 mb-5">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search district or city"
            className="w-full bg-transparent outline-none text-base md:text-lg text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          {/* Region select */}
          <div>
            <label className="block text-sm font-semibold text-[#123532] mb-2">
              Select Kerala Region
            </label>
            <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-xl px-4 py-3 text-gray-700">
              <span className="flex items-center gap-2">
                <MapPin size={18} className="text-gray-500" />
                All Regions
              </span>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </div>

          {/* Service select */}
          <div>
            <label className="block text-sm font-semibold text-[#123532] mb-2">
              Target Solar Service Offered
            </label>
            <div className="flex items-center justify-between gap-2 border border-gray-200 rounded-xl px-4 py-3 text-gray-700">
              <span className="flex items-center gap-2">
                <Sun size={18} className="text-gray-500" />
                Service Offered
              </span>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </div>

          {/* Explore button */}
          <button className="btn bg-[#F7BA41] hover:bg-yellow-500 text-[#272218] gap-2 h-[50px] w-full lg:w-auto">
            <Search size={18} />
            Explore service areas
          </button>
        </div>
      </div>
    </section>
  );
}

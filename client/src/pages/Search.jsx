import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FacilityCard from "../components/FacilityCard";

export default function Search() {
  const [facilities, setFacilities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 8;
  const [totalFacilities, setTotalFacilities] = useState(0);

  const [filters, setFilters] = useState({
    searchTerm: "",
    sport: "",
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Sync filters and page from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      searchTerm: params.get("searchTerm") || "",
      sport: params.get("sport") || "",
    });
    setCurrentPage(parseInt(params.get("page") || "0"));
  }, [location.search]);

  // Fetch facilities whenever filters or currentPage change
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const queryParams = new URLSearchParams();

        if (filters.searchTerm.trim())
          queryParams.set("searchTerm", filters.searchTerm.trim());

        if (filters.sport.trim()) queryParams.set("sport", filters.sport.trim());

        queryParams.set("startIndex", currentPage * cardsPerPage);
        queryParams.set("limit", cardsPerPage);

        const res = await fetch(`/api/facility/getfacilities?${queryParams}`);
        if (!res.ok) throw new Error("Failed to fetch facilities");

        const data = await res.json();
        setFacilities(data.facilities || []);
        setTotalFacilities(data.totalFacilities || 0);
      } catch (error) {
        console.error(error);
        setFacilities([]);
        setTotalFacilities(0);
      }
    };

    fetchFacilities();
  }, [filters, currentPage]);

  // Update URL on filters or page change triggered by user
  const updateURL = (newFilters, newPage = 0) => {
    const queryParams = new URLSearchParams();

    if (newFilters.searchTerm.trim())
      queryParams.set("searchTerm", newFilters.searchTerm.trim());

    if (newFilters.sport.trim()) queryParams.set("sport", newFilters.sport.trim());

    queryParams.set("page", newPage);

    navigate(`/search?${queryParams.toString()}`, { replace: true });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newFilters = { ...filters, [id]: value };
    setFilters(newFilters);
    setCurrentPage(0);
    updateURL(newFilters, 0);
  };

  const clearFilters = () => {
    const clearedFilters = { searchTerm: "", sport: "" };
    setFilters(clearedFilters);
    setCurrentPage(0);
    navigate("/search", { replace: true });
  };

  const nextPage = () => {
    if ((currentPage + 1) * cardsPerPage < totalFacilities) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      updateURL(filters, newPage);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      updateURL(filters, newPage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-6 border-b md:border-r md:min-h-screen border-gray-500 w-full md:w-64 bg-black text-white">
        <div className="flex flex-col gap-8">
          {/* Search Input */}
          <div>
            <label className="block mb-2">Search by name or sport</label>
            <input
              id="searchTerm"
              type="text"
              placeholder="Enter venue name or sport"
              value={filters.searchTerm}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-white rounded-md bg-black text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Sport Filter
          <div>
            <label className="block mb-2">Filter by sport type</label>
            <select
              id="sport"
              value={filters.sport}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-white rounded-md bg-black text-white focus:outline-none focus:border-pink-500"
            >
              <option value="">All Sports</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="cricket">Cricket</option>
            </select>
          </div> */}

          {/* Clear Filters */}
          <button
            type="button"
            onClick={clearFilters}
            className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-4">
        {facilities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {facilities.map((facility) => (
                <FacilityCard key={facility._id} facility={facility} />
              ))}
            </div>

            {/* Pagination */}
            {totalFacilities > cardsPerPage && (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  ←
                </button>
                <button
                  onClick={nextPage}
                  disabled={(currentPage + 1) * cardsPerPage >= totalFacilities}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  →
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center mt-10 text-gray-500">No facilities found.</p>
        )}
      </div>
    </div>
  );
}

import { Home, Filter, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const propertyTypes = ["House", "Apartment", "Villa", "Office"];
const availabilityTypes = ["Rent", "Buy", "Lease"];

const priceRanges = [
  { min: 0, max: 60000, label: "Under $60K" },
  { min: 60000, max: 120000, label: "$60K - $120K" },
  { min: 120000, max: 240000, label: "$120K - $240K" },
  { min: 240000, max: Number.MAX_SAFE_INTEGER, label: "Above $240K" }
];

const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  const handleChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: prevFilters[filterName] === value ? "" : value,
    }));
  };

  const handlePriceRangeChange = (range) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: { min: range.min, max: range.max, label: range.label },
    }));
  };

  const handleReset = () => {
    setFilters({
      propertyType: "",
      priceRange: { min: 0, max: Number.MAX_SAFE_INTEGER, label: "" },
      bedrooms: "0",
      bathrooms: "0",
      availability: "",
      searchQuery: "",
      sortBy: ""
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-lg mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <Filter className="w-6 h-6 mr-2 text-blue-600" /> Filters
        </h2>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Property Type Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Property Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type}
              onClick={() => handleChange("propertyType", type)}
              className={`px-4 py-2.5 rounded-md text-sm font-medium border transition-all duration-200 ease-in-out
                ${
                  filters.propertyType === type
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                }`}
            >
              {type}
            </button>
          ))}
          </div>
        </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
          <DollarSign className="w-5 h-5 mr-1.5 text-blue-600" /> Price Range
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {priceRanges.map((range) => (
          <button
              key={range.label}
              onClick={() => handlePriceRangeChange(range)}
              className={`px-4 py-2.5 rounded-md text-sm font-medium border transition-all duration-200 ease-in-out
                ${
                  filters.priceRange && filters.priceRange.label === range.label
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                }`}
          >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Placeholder for other filters */}
      {/* 
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Other Filters</h3>
        // Add UI for bedrooms, bathrooms, availability, search, sort by etc.
      </div>
      */}
      <motion.button
        onClick={() => onApplyFilters(filters)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
      >
        Apply Filters
      </motion.button>
    </motion.div>
  );
};

export default FilterSection;
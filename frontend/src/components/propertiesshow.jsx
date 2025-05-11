import { MapPin, BedDouble, Bath, Maximize, Heart, Eye, ArrowRight, Building, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backendurl } from '../App';

// Sample properties (fallback)
const sampleProperties = [
  { _id: '1', title: 'Luxury Villa', location: 'Beverly Hills, CA', price: 2500000, beds: 5, baths: 6, sqft: 5000, type: 'Villa', availability: 'Sale', image: 'https://via.placeholder.com/400x300.png?text=Luxury+Villa' },
  { _id: '2', title: 'Modern Apartment', location: 'Downtown, NY', price: 1200000, beds: 2, baths: 2, sqft: 1200, type: 'Apartment', availability: 'Rent', image: 'https://via.placeholder.com/400x300.png?text=Modern+Apartment' },
];

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleNavigate = () => {
    navigate(`/properties/single/${property._id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); 
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-shadow duration-300 ease-in-out"
      onClick={handleNavigate}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img
          src={property.image || 'https://via.placeholder.com/400x300.png?text=Property+Image'}
          alt={property.title}
          className="w-full h-56 object-cover"
        />
        <button 
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-red-100'
          }`}
          aria-label="Favorite"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full p-4">
          <h3 className="text-white text-lg font-semibold truncate">{property.title}</h3>
          <div className="flex items-center text-gray-200 text-sm mt-1">
            <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-blue-600 font-bold">
            <span className="text-xl">
              {Number(property.price).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0, 
              })}
            </span>
          </div>
          <div className={`text-sm px-3 py-1 rounded-full font-medium ${
            property.availability === 'Rent' || property.availability === 'rental'
              ? 'bg-green-100 text-green-800'
              : 'bg-indigo-100 text-indigo-800'
          }`}>
            For {property.availability === 'Rent' || property.availability === 'rental' ? 'Rent' : 'Sale'}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4 border-t pt-3">
          <div className="flex items-center flex-col sm:flex-row">
            <BedDouble className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{property.beds || 'N/A'} Beds</span>
          </div>
          <div className="flex items-center flex-col sm:flex-row">
            <Bath className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{property.baths || 'N/A'} Baths</span>
          </div>
          <div className="flex items-center flex-col sm:flex-row">
            <Maximize className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{property.sqft || 'N/A'} sqft</span>
          </div>
        </div>
        
        <div className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-md flex items-center justify-center">
            <Building className="w-3.5 h-3.5 mr-1" />
            <span>{property.type || 'Property'} - {property.availability === 'Rent' ? 'Rental' : 'Purchase'}</span>
        </div>
      </div>
        </motion.div>
  );
};

const PropertiesShow = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Backendurl}/api/products/list`);
        
        if (response.data && response.data.success && Array.isArray(response.data.property)) {
          setProperties(response.data.property);
        } else if (response.data && Array.isArray(response.data)) { 
          setProperties(response.data);
        } else {
          console.warn("Unexpected API response structure or unsuccessful fetch in PropertiesShow:", response.data);
        setProperties(sampleProperties); 
      }
        setError(null);
      } catch (err) {
        console.error("Error fetching properties in PropertiesShow:", err);
        setError("Failed to load properties. Displaying sample data.");
        setProperties(sampleProperties); 
      } finally {
        setLoading(false);
      }
};

    fetchProperties();
  }, []);

  const categories = ['all', 'Apartment', 'Villa', 'House', 'Office']; 

  const filteredProperties = activeCategory === 'all'
    ? properties
    : properties.filter(p => p.type && p.type.toLowerCase() === activeCategory.toLowerCase());
  
  const featuredProperties = Array.isArray(properties) ? properties.slice(0, 6) : [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="w-full h-56 bg-gray-300"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !featuredProperties.length) { 
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }
  
  const propertiesToDisplay = featuredProperties;
  return (
    <div className="bg-gray-50"> {/* Removed min-h-screen if this is part of home */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl"> {/* Changed h1 to h2 for semantics if on home page */}
            Featured Properties 
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties.
          </p>
        </div>

        {error && <p className="text-center text-orange-500 mb-4">{error}</p>}

        {propertiesToDisplay.length === 0 && !loading ? (
          <div className="text-center py-10">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No featured properties available at the moment.</p>
            <p className="text-gray-500">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {propertiesToDisplay.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/properties')} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
          >
            View All Properties <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesShow;
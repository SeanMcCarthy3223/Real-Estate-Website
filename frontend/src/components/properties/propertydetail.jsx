import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BedDouble, 
  Bath, 
  Maximize, 
  ArrowLeft, 
  Phone, 
  Calendar, 
  MapPin,
  Loader,
  Building,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Compass,
  Check, 
  AlertCircle,
  X
} from "lucide-react";
import ScheduleViewing from "./ScheduleViewing";
import { Backendurl } from "../../App.jsx";
import StructuredData from '../SEO/StructuredData';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const parseAmenities = useCallback((amenities) => {
    if (!amenities) return [];
    if (Array.isArray(amenities) && typeof amenities[0] === 'object') return amenities.map(a => a.name || a); // If already array of objects
    if (Array.isArray(amenities) && typeof amenities[0] === 'string') {
      try {
        // Handle cases where amenities might be a stringified array within an array
        const firstElement = amenities[0];
        if (firstElement.startsWith('[') && firstElement.endsWith(']')) {
          return JSON.parse(firstElement.replace(/'/g, '"'));
        }
        return amenities; // Already an array of strings
      } catch (e) {
        console.error("Error parsing amenities string:", e);
        return amenities; // Return as is if parsing fails
      }
    }
    if (typeof amenities === 'string') {
      try {
        return JSON.parse(amenities.replace(/'/g, '"'));
      } catch (e) {
        console.error("Error parsing amenities string:", e);
        return [amenities]; // Treat as a single amenity if parsing fails
      }
    }
    return [];
  }, []);
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${Backendurl}/api/products/single/${id}`);

        if (response.data.success) {
          const propertyData = response.data.property;
          setProperty({
            ...propertyData,
            amenities: parseAmenities(propertyData.amenities)
          });
        } else {
          setError(response.data.message || "Failed to load property details.");
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, parseAmenities]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  const handleShare = async () => {
    if (!property) return;
    const shareUrl = window.location.href;
    const shareTitle = property.title;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out this property: ${property.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Optionally show a toast notification for error
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Hide message after 2s
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        // Optionally show a toast notification for error
      }
    }
  };

  const nextImage = useCallback(() => {
    if (property && property.image && property.image.length > 0) {
      setActiveImage((prev) => (prev + 1) % property.image.length);
    }
  }, [property]);

  const prevImage = useCallback(() => {
    if (property && property.image && property.image.length > 0) {
      setActiveImage((prev) => (prev - 1 + property.image.length) % property.image.length);
    }
  }, [property]);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showSchedule && event.key === 'Escape') {
        setShowSchedule(false);
      } else if (!showSchedule) { // Only allow image navigation if modal is not open
        if (event.key === 'ArrowRight') {
          nextImage();
        } else if (event.key === 'ArrowLeft') {
          prevImage();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSchedule, nextImage, prevImage]);

  const handleCloseAndReturnToList = () => {
    navigate('/properties');
};

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="mb-4 h-8 bg-gray-300 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-96 bg-gray-300 rounded-lg mb-4"></div>
            <div className="flex space-x-2 mb-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 w-20 bg-gray-300 rounded"></div>)}
            </div>
          </div>
          <div>
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-12 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-6 bg-gray-300 rounded"></div>)}
            </div>
            <div className="mt-6 h-12 bg-blue-300 rounded w-full"></div>
            <div className="mt-4 h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </div>
        <div className="mt-8">
          <div className="h-8 bg-gray-300 rounded w-1/5 mb-4"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-300 rounded"></div>)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Property Not Found</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link
          to="/properties"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  if (!property) {
    return <div className="text-center py-10">Property data is not available.</div>;
  }

  const images = Array.isArray(property.image) && property.image.length > 0 
    ? property.image 
    : (typeof property.image === 'string' ? [property.image] : ['https://via.placeholder.com/800x600.png?text=No+Image']);

  return (
    <>
    {property && <StructuredData type="propertyListing" data={{
        id: property._id,
        title: property.title,
        description: property.description,
        image: images[0],
        price: property.price,
        availability: property.availability
    }} />}
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <motion.button
                onClick={handleCloseAndReturnToList}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            aria-label="Back to properties list"
            >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
            </motion.button>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Image Gallery */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative aspect-[16/10] bg-gray-200 rounded-xl shadow-lg overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${property.title} - Image ${activeImage + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`w-2.5 h-2.5 rounded-full ${index === activeImage ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                          } transition-all duration-150`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all
                                ${activeImage === index ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-1' : 'border-transparent hover:border-gray-400'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Property Info (Call to Action Card) */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl sticky top-8">
              <div className="flex justify-between items-center mb-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full
                  ${property.availability === 'Rent' || property.availability === 'rental'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'}`}>
                  For {property.availability === 'Rent' || property.availability === 'rental' ? 'Rent' : 'Sale'}
                </span>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={handleShare} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Share property"
                    >
                        {copySuccess ? <Check size={20} className="text-green-500" /> : <Share2 size={20} />}
              </button>
                    <motion.button
                        onClick={handleCloseAndReturnToList}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        aria-label="Close property details"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                 >
                        <X size={20} />
                    </motion.button>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4 text-sm">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>{property.location}</span>
            </div>

              <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-6">
                {Number(property.price).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center border-t border-b border-gray-200 py-5 mb-6">
                <div>
                  <BedDouble size={24} className="mx-auto mb-1 text-blue-500" />
                  <p className="text-sm text-gray-700">{property.beds} Beds</p>
                </div>
                <div>
                  <Bath size={24} className="mx-auto mb-1 text-blue-500" />
                  <p className="text-sm text-gray-700">{property.baths} Baths</p>
                      </div>
                <div>
                  <Maximize size={24} className="mx-auto mb-1 text-blue-500" />
                  <p className="text-sm text-gray-700">{property.sqft} sqft</p>
                  </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Property Type</h3>
                <p className="text-gray-600 flex items-center"><Building size={16} className="mr-2 text-gray-500"/>{property.type}</p>
              </div>
              <button
                onClick={() => setShowSchedule(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Calendar size={20} className="mr-2.5" />
                Schedule a Viewing
              </button>
              {property.phone && (
                 <a href={`tel:${property.phone}`}
                    className="mt-3 w-full border border-blue-600 text-blue-600 font-semibold py-3.5 px-6 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
                 >
                    <Phone size={20} className="mr-2.5" />
                    Call Agent
                 </a>
              )}
            </div>
          </motion.div>

          {/* Location Section (Left Column, below image gallery) */}
          <motion.div 
            className="lg:col-span-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Compass size={22} className="mr-3 text-blue-600"/>Location
                </h2>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Map placeholder for {property.location}</p>
                </div>
            </div>
          </motion.div>
          
          {/* About this property & Amenities Section (Right Column, below CTA card) */}
          <motion.div 
            className="lg:col-span-2 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }} // Adjusted delay for staggered effect
          >
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">
                {property.description}
              </p>

              {property.amenities && property.amenities.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-5">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <Check size={18} className="mr-2.5 text-green-500 flex-shrink-0" />
                        <span>{amenity}</span>
    </div>
                    ))}
                  </div>
    </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showSchedule && (
          <ScheduleViewing
            propertyId={property._id}
            propertyTitle={property.title}
            propertyLocation={property.location}
            propertyImage={images[0]}
            onClose={() => setShowSchedule(false)}
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
};

export default PropertyDetails;
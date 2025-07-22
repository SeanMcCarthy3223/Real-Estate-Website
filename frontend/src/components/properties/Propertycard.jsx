import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MapPin, BedDouble, Bath, Maximize, Share2, Copy, Check, ChevronLeft, ChevronRight, Eye, Building } from 'lucide-react';

const PropertyCard = ({ property, viewType }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showControls, setShowControls] = useState(false);

  if (!property) {
    return null; // Or some placeholder/error display
  }

  const handleNavigateToDetails = () => {
    navigate(`/properties/single/${property._id}`);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/properties/single/${property._id}`;
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
    }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!'); // Replace with a toast notification
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Failed to copy link.'); // Replace with a toast notification
    }
    }
  };

  const images = property.image && Array.isArray(property.image) && property.image.length > 0
    ? property.image
    : (property.image && typeof property.image === 'string' ? [property.image] : ['https://via.placeholder.com/400x300.png?text=No+Image']);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const cardClasses = viewType === 'grid'
    ? "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl"
    : "bg-white rounded-xl shadow-lg overflow-hidden flex flex-col sm:flex-row transition-all duration-300 ease-in-out hover:shadow-2xl mb-6";

  const imageContainerClasses = viewType === 'grid'
    ? "w-full h-56"
    : "w-full sm:w-1/3 h-56 sm:h-auto flex-shrink-0";
  
  const contentClasses = viewType === 'grid'
    ? "p-5 flex flex-col flex-grow"
    : "p-5 flex flex-col flex-grow sm:w-2/3";

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={cardClasses}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleNavigateToDetails}
      role="article"
      aria-labelledby={`property-title-${property._id}`}
    >
      <div className={`relative ${imageContainerClasses} overflow-hidden`}>
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        {images.length > 1 && showControls && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-10">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                    } transition-all`}
                />
              ))}
            </div>
          </>
        )}
        <div className={`absolute top-2 right-2 p-1.5 rounded-full text-xs font-semibold z-10
            ${property.availability === 'Rent' || property.availability === 'rental' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
            For {property.availability === 'Rent' || property.availability === 'rental' ? 'Rent' : 'Sale'}
        </div>
      </div>

      <div className={contentClasses}>
        <div className="flex items-center text-gray-500 text-sm mb-1">
          <MapPin size={16} className="mr-1.5 flex-shrink-0" />
          <span className="truncate">{property.location || 'N/A'}</span>
        </div>
        <h3 id={`property-title-${property._id}`} className="text-xl font-semibold text-gray-800 mb-2 truncate hover:text-blue-600 transition-colors">
          {property.title || 'Untitled Property'}
        </h3>
        
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
           <div className="text-sm bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md flex items-center">
            <Building className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            {property.type || 'N/A'}
          </div>
        </div>

        <div className={`grid ${viewType === 'grid' ? 'grid-cols-3 gap-2' : 'grid-cols-3 sm:grid-cols-3 gap-3'} text-sm text-gray-600 mb-4 border-t border-gray-200 pt-3`}>
          <div className="flex items-center">
            <BedDouble size={16} className="mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{property.beds || 'N/A'} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{property.baths || 'N/A'} Baths</span>
          </div>
          <div className="flex items-center">
            <Maximize size={16} className="mr-1.5 text-blue-500 flex-shrink-0" />
            <span>{property.sqft ? `${property.sqft} sqft` : 'N/A'}</span>
          </div>
        </div>
        
        {viewType === 'list' && property.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {property.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-200">
          <button
            onClick={(e) => { e.stopPropagation(); handleNavigateToDetails(); }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            aria-label={`View details for ${property.title}`}
          >
            View Details <Eye size={16} className="ml-1.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share this property"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    location: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    beds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    baths: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sqft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string,
    availability: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  viewType: PropTypes.oneOf(['grid', 'list']).isRequired,
};

export default PropertyCard;
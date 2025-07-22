import PropTypes from 'prop-types';

const StructuredData = ({ type, data }) => {
  const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'BuildEstate',
      url: 'https://buildestate.vercel.app',
      potentialAction: {
        '@type': 'SearchAction',
      target: 'https://buildestate.vercel.app/properties?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const propertyListingSchema = (listingData) => ({
    '@context': 'https://schema.org',
    '@type': 'Product', // Or RealEstateListing for more specific schema
    name: listingData.title,
    description: listingData.description,
    image: listingData.image,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD', // Updated currency
      price: listingData.price, // Ensure price is a number
      availability: listingData.availability === 'Sale' ? 'https://schema.org/InStock' : 'https://schema.org/InStoreOnly', // Example mapping
      url: `https://buildestate.vercel.app/properties/single/${listingData.id}`,
    },
    // Add more specific RealEstateListing properties if applicable
  });
  
  const aiHubSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'AI Property Hub',
      applicationCategory: 'RealEstateApplication',
      description: 'AI-powered real estate analytics and recommendations tool',
      url: 'https://buildestate.vercel.app/ai-property-hub',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD', // Updated currency
        availability: 'https://schema.org/InStock'
      }
};

  const schemas = {
    website: websiteSchema,
    propertyListing: data ? propertyListingSchema(data) : {},
    aiHub: aiHubSchema
};

  const schemaData = schemas[type] || schemas.website;

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

StructuredData.propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.object
};

export default StructuredData;
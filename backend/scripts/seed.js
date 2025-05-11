import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config({ path: './.env' });

// Import Mongoose Models
import User from '../models/Usermodel.js';
import Property from '../models/propertymodel.js';
import Appointment from '../models/appointmentModel.js';
import Form from '../models/formmodel.js';
import News from '../models/newsmodel.js';

// Curated list of real estate image URLs from Pexels (or similar free stock sites)
const realEstateImagePool = [
  // Apartments & Interiors
  'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Spacious modern living room
  'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Stylish apartment living area
  'https://images.pexels.com/photos/3935320/pexels-photo-3935320.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Cozy apartment bedroom
  'https://images.pexels.com/photos/7031408/pexels-photo-7031408.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Modern kitchen
  'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Apartment living/study
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Bright living room with large windows
  'https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Apartment exterior/balcony view

  // Houses, Villas & Exteriors
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Classic suburban house
  'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Luxury villa exterior
  'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // House with garden
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Modern house exterior
  'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Waterfront villa/house
  'https://images.pexels.com/photos/209296/pexels-photo-209296.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Traditional Indian house style

  // Commercial / Plot (more generic but can fit)
  'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Modern office building exterior
  'https://images.pexels.com/photos/221024/pexels-photo-221024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Office interior
  'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Aerial view of land/plots
];

let imageIndex = 0;
const getPropertyImages = (count = 1) => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push(realEstateImagePool[imageIndex % realEstateImagePool.length]);
    imageIndex++;
  }
  return images;
};

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in your .env file');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Appointment.deleteMany();
    await Property.deleteMany();
    await User.deleteMany();
    await Form.deleteMany();
    await News.deleteMany();
    console.log('Data Destroyed!');
  } catch (err) {
    console.error(`Error destroying data: ${err.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    imageIndex = 0; // Reset image index for each import run
    // --- Create Users ---
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const usersToCreate = [
      {
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@buildestate.com',
        password: adminPassword,
      },
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: userPassword,
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: userPassword,
      },
    ];
    const createdUsers = await User.insertMany(usersToCreate);
    const adminUser = createdUsers[0];
    const regularUser1 = createdUsers[1];
    const regularUser2 = createdUsers[2];
    console.log('Users Imported...');

    // --- Create Properties ---
    const propertiesToCreate = [
      {
        title: 'Spacious Downtown Apartment',
        location: 'Mumbai, Maharashtra',
        price: 7500000,
        image: getPropertyImages(2), // Gets 2 images from the pool
        beds: 2,
        baths: 2,
        sqft: 1200,
        type: 'Apartment',
        availability: 'Ready to move',
        description: 'A beautiful and spacious apartment in the heart of downtown Mumbai, offering stunning city views and modern amenities.',
        amenities: ['Swimming Pool', 'Gym', 'Parking', '24/7 Security'],
        phone: '9876543210',
      },
      {
        title: 'Luxury Villa with Sea View',
        location: 'Goa',
        price: 25000000,
        image: getPropertyImages(2),
        beds: 4,
        baths: 5,
        sqft: 3500,
        type: 'Villa',
        availability: 'Under Construction',
        description: 'Experience luxury living in this stunning sea-view villa in Goa, complete with a private pool and garden.',
        amenities: ['Private Pool', 'Garden', 'Sea View', 'Modular Kitchen'],
        phone: '9876543211',
      },
      {
        title: 'Cozy Suburban House',
        location: 'Bangalore, Karnataka',
        price: 9000000,
        image: getPropertyImages(2),
        beds: 3,
        baths: 2,
        sqft: 1800,
        type: 'House',
        availability: 'Ready to move',
        description: 'A charming and cozy house in a quiet suburban neighborhood of Bangalore, perfect for families.',
        amenities: ['Garden', 'Play Area', 'Covered Parking'],
        phone: '9876543212',
      },
      {
        title: 'Modern Studio Apartment',
        location: 'Pune, Maharashtra',
        price: 4500000,
        image: getPropertyImages(1),
        beds: 1,
        baths: 1,
        sqft: 600,
        type: 'Studio',
        availability: 'Ready to move',
        description: 'A sleek and modern studio apartment in Pune, ideal for young professionals or students.',
        amenities: ['Gym', 'Community Hall', 'Power Backup'],
        phone: '9876543213',
      },
      {
        title: 'Penthouse with Rooftop Terrace',
        location: 'Delhi NCR',
        price: 30000000,
        image: getPropertyImages(2),
        beds: 3,
        baths: 4,
        sqft: 2800,
        type: 'Penthouse',
        availability: 'Ready to move',
        description: 'Luxurious penthouse in Delhi NCR with a private rooftop terrace and panoramic city views.',
        amenities: ['Rooftop Terrace', 'Jacuzzi', 'Home Theatre', 'Servant Quarters'],
        phone: '9876543214',
      },
      {
        title: 'Affordable 1BHK Flat',
        location: 'Chennai, Tamil Nadu',
        price: 3500000,
        image: getPropertyImages(1),
        beds: 1,
        baths: 1,
        sqft: 550,
        type: 'Apartment',
        availability: 'New Launch',
        description: 'An affordable 1BHK flat in a developing area of Chennai, great for first-time homebuyers.',
        amenities: ['Lift', 'Parking', 'Security'],
        phone: '9876543215',
      },
      {
        title: 'Commercial Office Space',
        location: 'Hyderabad, Telangana',
        price: 12000000,
        image: [realEstateImagePool[13], realEstateImagePool[14]], // Specifically picking office images
        beds: 0,
        baths: 2,
        sqft: 2000,
        type: 'Commercial',
        availability: 'For Lease',
        description: 'Prime commercial office space in the IT hub of Hyderabad, suitable for startups and established businesses.',
        amenities: ['Conference Room', 'Pantry', 'Reception Area', 'High-Speed Internet'],
        phone: '9876543216',
      },
      {
        title: 'Farmhouse with Acreage',
        location: 'Lonavala, Maharashtra',
        price: 18000000,
        image: getPropertyImages(2),
        beds: 3,
        baths: 3,
        sqft: 2500,
        type: 'Farmhouse',
        availability: 'Resale',
        description: 'A serene farmhouse in Lonavala with ample land, perfect for weekend getaways or organic farming.',
        amenities: ['Large Garden', 'Outhouse', 'Borewell', 'Fruit Trees'],
        phone: '9876543217',
      },
      {
        title: 'Compact City Center Flat',
        location: 'Kolkata, West Bengal',
        price: 5500000,
        image: getPropertyImages(1),
        beds: 2,
        baths: 1,
        sqft: 800,
        type: 'Apartment',
        availability: 'Ready to move',
        description: 'A compact and well-maintained flat in the bustling city center of Kolkata.',
        amenities: ['Lift', 'Security', 'Proximity to Metro'],
        phone: '9876543218',
      },
      {
        title: 'Plot for Custom Build',
        location: 'Jaipur, Rajasthan',
        price: 6000000,
        image: [realEstateImagePool[15]], // Specifically picking a plot/land image
        beds: 0,
        baths: 0,
        sqft: 2400,
        type: 'Plot',
        availability: 'For Sale',
        description: 'Residential plot in a gated community in Jaipur, ideal for building your dream home.',
        amenities: ['Gated Community', 'Clubhouse Access', 'Park Facing'],
        phone: '9876543219',
      },
       {
        title: 'Elegant Duplex Home',
        location: 'Noida, Uttar Pradesh',
        price: 15000000,
        image: getPropertyImages(2),
        beds: 4,
        baths: 3,
        sqft: 2200,
        type: 'Duplex',
        availability: 'Ready to move',
        description: 'A beautifully designed duplex home in a prime locality of Noida, offering ample space and modern interiors.',
        amenities: ['Modular Kitchen', 'Balconies', 'Reserved Parking', 'Power Backup'],
        phone: '9876543220',
      }
    ];
    const createdProperties = await Property.insertMany(propertiesToCreate);
    console.log('Properties Imported...');

    // --- Create Appointments ---
    const appointmentsToCreate = [
      {
        propertyId: createdProperties[0]._id,
        userId: regularUser1._id,
        date: new Date(new Date().setDate(new Date().getDate() + 7)),
        time: '10:00 AM',
        status: 'pending',
        notes: 'Interested in understanding the society maintenance.',
      },
      {
        propertyId: createdProperties[1]._id,
        userId: regularUser2._id,
        date: new Date(new Date().setDate(new Date().getDate() + 10)),
        time: '02:30 PM',
        status: 'confirmed',
        meetingLink: 'https://meet.google.com/samplelink',
        meetingPlatform: 'google-meet',
        notes: 'Virtual tour requested.',
      },
      {
        propertyId: createdProperties[2]._id,
        userId: adminUser._id,
        date: new Date(new Date().setDate(new Date().getDate() + 5)),
        time: '11:00 AM',
        status: 'pending',
      },
    ];
    await Appointment.insertMany(appointmentsToCreate);
    console.log('Appointments Imported...');

    // --- Create Form Submissions ---
    const formsToCreate = [
      {
        name: 'Alice Wonderland',
        email: 'alice.w@example.com',
        phone: '1234567890',
        message: 'I would like to know more about properties in South Mumbai.',
      },
      {
        name: 'Bob The Builder',
        email: 'bob.b@example.com',
        message: 'Are there any commercial properties available for lease?',
      },
    ];
    await Form.insertMany(formsToCreate);
    console.log('Forms Imported...');

    // --- Create Newsletter Subscriptions ---
    const newsToCreate = [
      { email: 'subscriber1@example.com' },
      { email: 'subscriber2@example.net' },
      { email: adminUser.email },
    ];
    await News.insertMany(newsToCreate);
    console.log('Newsletter Subscriptions Imported...');

    console.log('Data Imported Successfully!');
  } catch (err) {
    console.error(`Error importing data: ${err.message}`);
    if (err.message.includes('buffering timed out after 10000ms')) {
        console.error('This might be a MongoDB connection issue or the server is too slow. Check your MongoDB instance and network.');
    }
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();

  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await destroyData();
    await importData();
  }

  await mongoose.disconnect();
  console.log('MongoDB Disconnected.');
  process.exit();
};

seedDatabase();
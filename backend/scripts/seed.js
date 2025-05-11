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

// Curated list of real estate image URLs from Pexels (or similar free stock sites) - US Focused
const realEstateImagePool = [
  // Apartments & Interiors (US Style)
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Modern apartment living room
  'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Bright apartment interior
  'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Apartment kitchen/dining
  'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Urban loft apartment
  'https://images.pexels.com/photos/6585756/pexels-photo-6585756.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Apartment bedroom
  // Houses, Villas & Exteriors (US Style)
  'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Suburban American house
  'https://images.pexels.com/photos/209315/pexels-photo-209315.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Modern US house exterior
  'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // House with a pool
  'https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Large suburban home
  'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Two-story family house

  // Luxury / Unique Homes
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Luxury modern home
  'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Beachfront property

  // Commercial / Plot (more generic but can fit)
  'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Downtown office building
  'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1', // Modern office interior
  'https://images.pexels.com/photos/53610/large-home-residential-house-architecture-53610.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1' // Large residential plot / land
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

    // --- Create Properties (US Cities & USD) ---
    const propertiesToCreate = [
      {
        title: 'Spacious Downtown Loft',
        location: 'New York, NY',
        price: 1250000, // USD
        image: getPropertyImages(2),
        beds: 2,
        baths: 2,
        sqft: 1500,
        type: 'Apartment', // Loft can be a type of apartment
        availability: 'For Sale',
        description: 'A beautiful and spacious loft in the heart of downtown New York, offering stunning city views and modern amenities.',
        amenities: ['Rooftop Deck', 'Fitness Center', 'Concierge', 'Valet Parking'],
        phone: '555-0100',
      },
      {
        title: 'Luxury Beachfront Villa',
        location: 'Malibu, CA',
        price: 7800000, // USD
        image: getPropertyImages(2),
        beds: 4,
        baths: 5,
        sqft: 4200,
        type: 'Villa',
        availability: 'For Sale',
        description: 'Experience luxury living in this stunning beachfront villa in Malibu, complete with a private pool and direct beach access.',
        amenities: ['Private Pool', 'Oceanfront', 'Home Theater', 'Gourmet Kitchen'],
        phone: '555-0101',
      },
      {
        title: 'Cozy Suburban Family Home',
        location: 'Austin, TX',
        price: 650000, // USD
        image: getPropertyImages(2),
        beds: 3,
        baths: 2.5,
        sqft: 2200,
        type: 'House',
        availability: 'For Sale',
        description: 'A charming and cozy house in a quiet suburban neighborhood of Austin, perfect for families, with a large backyard.',
        amenities: ['Large Backyard', 'Play Area', 'Two-Car Garage', 'Community Pool'],
        phone: '555-0102',
      },
      {
        title: 'Modern Studio Apartment',
        location: 'Chicago, IL',
        price: 320000, // USD
        image: getPropertyImages(1),
        beds: 1, // Studio often means 0 or 1 bed
        baths: 1,
        sqft: 650,
        type: 'Studio',
        availability: 'For Rent',
        description: 'A sleek and modern studio apartment in Chicago, ideal for young professionals or students, close to public transport.',
        amenities: ['In-unit Laundry', 'Gym', 'Rooftop Lounge', 'Pet Friendly'],
        phone: '555-0103',
      },
      {
        title: 'Penthouse with Panoramic Views',
        location: 'San Francisco, CA',
        price: 4500000, // USD
        image: getPropertyImages(2),
        beds: 3,
        baths: 3,
        sqft: 2800,
        type: 'Penthouse',
        availability: 'For Sale',
        description: 'Luxurious penthouse in San Francisco with a private rooftop terrace and panoramic city and bay views.',
        amenities: ['Private Elevator', 'Rooftop Terrace', 'Smart Home System', 'Wine Cellar'],
        phone: '555-0104',
      },
      {
        title: 'Affordable Urban Condo',
        location: 'Philadelphia, PA',
        price: 280000, // USD
        image: getPropertyImages(1),
        beds: 1,
        baths: 1,
        sqft: 750,
        type: 'Condo', // Condo is a common US term
        availability: 'For Sale',
        description: 'An affordable 1-bedroom condo in a vibrant area of Philadelphia, great for first-time homebuyers or investors.',
        amenities: ['Shared Courtyard', 'Bike Storage', 'Low HOA Fees'],
        phone: '555-0105',
      },
      {
        title: 'Prime Commercial Space',
        location: 'Seattle, WA',
        price: 2200000, // USD
        image: [realEstateImagePool[12], realEstateImagePool[13]], // Specifically picking office images
        beds: 0,
        baths: 2, // Common restrooms
        sqft: 3000,
        type: 'Commercial',
        availability: 'For Lease',
        description: 'Prime commercial office space in downtown Seattle, suitable for tech startups and established businesses.',
        amenities: ['High-Speed Fiber', 'Conference Rooms', 'Kitchenette', 'Reception Area'],
        phone: '555-0106',
      },
      {
        title: 'Ranch-Style Home with Acreage',
        location: 'Denver, CO', // Ranch style fits Denver outskirts
        price: 850000, // USD
        image: getPropertyImages(2),
        beds: 3,
        baths: 2,
        sqft: 2500,
        type: 'House', // Ranch is a type of house
        availability: 'For Sale',
        description: 'A spacious ranch-style home near Denver with ample land, perfect for those seeking space and mountain views.',
        amenities: ['Large Deck', 'Workshop', 'Horse Permitted', 'Mountain Views'],
        phone: '555-0107',
      },
      {
        title: 'Historic Townhouse',
        location: 'Boston, MA',
        price: 980000, // USD
        image: getPropertyImages(1),
        beds: 2,
        baths: 1.5,
        sqft: 1600,
        type: 'Townhouse',
        availability: 'For Sale',
        description: 'A beautifully maintained historic townhouse in a charming Boston neighborhood.',
        amenities: ['Original Hardwood Floors', 'Private Patio', 'Walk to Shops'],
        phone: '555-0108',
      },
      {
        title: 'Residential Lot for Custom Home',
        location: 'Phoenix, AZ',
        price: 150000, // USD
        image: [realEstateImagePool[14]], // Specifically picking a plot/land image
        beds: 0,
        baths: 0,
        sqft: 10890, // Quarter acre lot
        type: 'Lot/Land',
        availability: 'For Sale',
        description: 'Residential lot in a developing Phoenix suburb, ideal for building your dream custom home.',
        amenities: ['Utilities Available', 'Mountain Views', 'No HOA'],
        phone: '555-0109',
      },
       {
        title: 'Elegant Duplex in Miami',
        location: 'Miami, FL',
        price: 1750000, // USD
        image: getPropertyImages(2),
        beds: 4,
        baths: 3.5,
        sqft: 3200,
        type: 'Duplex',
        availability: 'For Sale',
        description: 'A beautifully designed duplex home in a prime Miami location, offering ample space, modern interiors, and a private yard.',
        amenities: ['Impact Windows', 'Rooftop Deck', 'Private Yard', 'Smart Appliances'],
        phone: '555-0110',
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
        notes: 'Interested in viewing the loft next week.',
      },
      {
        propertyId: createdProperties[1]._id,
        userId: regularUser2._id,
        date: new Date(new Date().setDate(new Date().getDate() + 10)),
        time: '02:30 PM',
        status: 'confirmed',
        meetingLink: 'https://zoom.us/j/1234567890',
        meetingPlatform: 'zoom',
        notes: 'Virtual tour scheduled for the Malibu villa.',
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
        name: 'Michael Scott',
        email: 'michael.s@example.com',
        phone: '555-0200',
        message: 'I would like to know more about properties in Austin, TX.',
      },
      {
        name: 'Pam Beesly',
        email: 'pam.b@example.com',
        message: 'Are there any art studio spaces available for lease in Philadelphia?',
      },
    ];
    await Form.insertMany(formsToCreate);
    console.log('Forms Imported...');

    // --- Create Newsletter Subscriptions ---
    const newsToCreate = [
      { email: 'dwight.k.schrute@example.com' },
      { email: 'angela.martin@example.net' },
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
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Import models
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const MealPlan = require('../models/MealPlan');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    await connectDB();
    
    console.log('Clearing database...');
    
    // Clear all collections
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await MealPlan.deleteMany({});
    
    console.log('✅ Database cleared successfully!');
    
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

// Run the clear function
clearDatabase();

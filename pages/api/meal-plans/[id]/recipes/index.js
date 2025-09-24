import connectDB from '@/lib/mongodb';
import MealPlan from '@/models/MealPlan';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectDB();

  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      console.log('Adding recipe to meal plan:', id);
      console.log('Request body:', req.body);
      console.log('Session user ID:', session.user.id);
      console.log('Session user ID type:', typeof session.user.id);
      
      // Convert string ID to ObjectId
      const mongoose = require('mongoose');
      const ObjectId = mongoose.Types.ObjectId;
      
      // Validate ObjectId format
      console.log('Meal plan ID:', id);
      console.log('Meal plan ID type:', typeof id);
      if (!ObjectId.isValid(id)) {
        console.log('Invalid meal plan ID format:', id);
        return res.status(400).json({ message: 'Invalid meal plan ID format' });
      }
      
      // Validate session user ID format
      if (!ObjectId.isValid(session.user.id)) {
        console.log('Invalid session user ID format:', session.user.id);
        return res.status(400).json({ message: 'Invalid session user ID format' });
      }
      
      const mealPlan = await MealPlan.findOne({ 
        _id: new ObjectId(id), 
        createdBy: new ObjectId(session.user.id) 
      });
      if (!mealPlan) {
        console.log('Meal plan not found');
        return res.status(404).json({ message: 'Meal plan not found' });
      }

      console.log('Found meal plan:', mealPlan.name);
      console.log('Current recipes count:', mealPlan.recipes.length);

      // Validate required fields
      if (!req.body.recipe || !req.body.mealType) {
        return res.status(400).json({ 
          message: 'Missing required fields: recipe and mealType are required' 
        });
      }

      // Validate recipe ID format
      if (!ObjectId.isValid(req.body.recipe)) {
        return res.status(400).json({ message: 'Invalid recipe ID format' });
      }

      const newRecipe = {
        recipe: new ObjectId(req.body.recipe),
        mealType: req.body.mealType,
      };

      console.log('Adding new recipe:', newRecipe);
      mealPlan.recipes.push(newRecipe);
      await mealPlan.save();

      console.log('Updated recipes count:', mealPlan.recipes.length);
      console.log('All recipes:', mealPlan.recipes);

      res.status(201).json(mealPlan);
    } catch (error) {
      console.error('Error adding recipe to meal plan:', error);
      res.status(500).json({ message: 'Error adding recipe to meal plan', error: error.message });
    }
  } else if (req.method === 'OPTIONS') {
    // Handle preflight requests
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(200).end();
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

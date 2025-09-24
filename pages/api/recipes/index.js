import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    console.log('Session in recipes API:', session);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    if (req.method === 'GET') {
      try {
        console.log('Fetching ALL recipes');
        const recipes = await Recipe.find({}).populate('createdBy', 'name email').sort({ createdAt: -1 });
        console.log('Found recipes:', recipes.length);
        res.status(200).json(recipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
      }
    } else if (req.method === 'POST') {
      try {
        const recipe = await Recipe.create({
          ...req.body,
          createdBy: session.user.id,
        });
        res.status(201).json(recipe);
      } catch (error) {
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Error in recipes API:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

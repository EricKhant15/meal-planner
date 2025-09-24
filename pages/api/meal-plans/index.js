import connectDB from '@/lib/mongodb';
import MealPlan from '@/models/MealPlan';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      console.log('Fetching meal plans for user:', session.user.id);
      const mealPlans = await MealPlan.find({ createdBy: session.user.id })
        .sort({ createdAt: 1 });
      console.log('Found meal plans:', mealPlans.length);
      console.log('First meal plan recipes:', mealPlans[0]?.recipes);
      res.status(200).json(mealPlans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      res.status(500).json({ message: 'Error fetching meal plans', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const mealPlan = await MealPlan.create({
        ...req.body,
        createdBy: session.user.id,
      });
      res.status(201).json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: 'Error creating meal plan', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

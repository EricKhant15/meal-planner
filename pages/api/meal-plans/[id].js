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

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const mealPlan = await MealPlan.findOne({ _id: id, createdBy: session.user.id })
        .populate('recipes.recipe');
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
      res.status(200).json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching meal plan', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const mealPlan = await MealPlan.findOneAndUpdate(
        { _id: id, createdBy: session.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
      res.status(200).json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: 'Error updating meal plan', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const mealPlan = await MealPlan.findOneAndDelete({ _id: id, createdBy: session.user.id });
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }
      res.status(200).json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting meal plan', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

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

  const { id, recipeId } = req.query;

  if (req.method === 'DELETE') {
    try {
      const mealPlan = await MealPlan.findOne({ _id: id, createdBy: session.user.id });
      if (!mealPlan) {
        return res.status(404).json({ message: 'Meal plan not found' });
      }

      mealPlan.recipes = mealPlan.recipes.filter(
        (recipe) => recipe._id.toString() !== recipeId
      );
      await mealPlan.save();

      res.status(200).json({ message: 'Recipe removed from meal plan successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error removing recipe from meal plan', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

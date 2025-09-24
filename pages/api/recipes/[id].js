import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
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
      const recipe = await Recipe.findOne({ _id: id, createdBy: session.user.id });
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const recipe = await Recipe.findOneAndUpdate(
        { _id: id, createdBy: session.user.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const recipe = await Recipe.findOneAndDelete({ _id: id, createdBy: session.user.id });
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

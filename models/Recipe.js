import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
  }],
  instructions: [{
    step: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  }],
  prepTime: {
    type: Number, // in minutes
    required: true,
  },
  cookTime: {
    type: Number, // in minutes
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define models directly in the script
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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
    type: Number,
    required: true,
  },
  cookTime: {
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

const MealPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  recipes: [{
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true,
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      required: true,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

MealPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', RecipeSchema);
const MealPlan = mongoose.models.MealPlan || mongoose.model('MealPlan', MealPlanSchema);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

async function seedUsers() {
  console.log('👥 Seeding users...');
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 12),
    },
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 12),
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 12),
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: await bcrypt.hash('password123', 12),
    }
  ];

  // Clear existing users
  await User.deleteMany({});
  
  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
}

// This will be updated with all recipes
async function seedRecipes(users) {
  console.log('🍽️ Seeding recipes with photos...');
  
  const recipes = [
    {
      name: 'Classic Pancakes',
      description: 'Fluffy, golden pancakes perfect for breakfast with a touch of vanilla',
      photo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'All-purpose flour', amount: '1 cup' },
        { name: 'Sugar', amount: '2 tbsp' },
        { name: 'Baking powder', amount: '2 tsp' },
        { name: 'Salt', amount: '1/2 tsp' },
        { name: 'Milk', amount: '1 cup' },
        { name: 'Egg', amount: '1 large' },
        { name: 'Butter', amount: '2 tbsp melted' },
        { name: 'Vanilla extract', amount: '1 tsp' }
      ],
      instructions: [
        { step: 1, description: 'Mix dry ingredients in a large bowl' },
        { step: 2, description: 'In another bowl, whisk together milk, egg, melted butter, and vanilla' },
        { step: 3, description: 'Pour wet ingredients into dry ingredients and stir until just combined' },
        { step: 4, description: 'Heat a griddle or pan over medium heat' },
        { step: 5, description: 'Pour 1/4 cup batter for each pancake and cook until bubbles form' },
        { step: 6, description: 'Flip and cook until golden brown' }
      ],
      prepTime: 10,
      cookTime: 15,
      difficulty: 'Easy',
      category: 'Breakfast',
      createdBy: users[0]._id
    },
    {
      name: 'Grilled Salmon with Herbs',
      description: 'Perfectly grilled salmon fillet with fresh herbs and lemon',
      photo: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Salmon fillets', amount: '4 pieces (6oz each)' },
        { name: 'Olive oil', amount: '3 tbsp' },
        { name: 'Lemon juice', amount: '2 tbsp' },
        { name: 'Fresh dill', amount: '2 tbsp chopped' },
        { name: 'Fresh parsley', amount: '2 tbsp chopped' },
        { name: 'Garlic', amount: '2 cloves minced' },
        { name: 'Salt', amount: '1 tsp' },
        { name: 'Black pepper', amount: '1/2 tsp' }
      ],
      instructions: [
        { step: 1, description: 'Preheat grill to medium-high heat' },
        { step: 2, description: 'Mix olive oil, lemon juice, herbs, garlic, salt, and pepper' },
        { step: 3, description: 'Brush salmon fillets with the herb mixture' },
        { step: 4, description: 'Grill salmon skin-side down for 4-5 minutes' },
        { step: 5, description: 'Flip and grill for another 4-5 minutes' },
        { step: 6, description: 'Check internal temperature reaches 145°F' }
      ],
      prepTime: 15,
      cookTime: 10,
      difficulty: 'Medium',
      category: 'Main Course',
      createdBy: users[0]._id
    },
    {
      name: 'Mediterranean Quinoa Salad',
      description: 'Fresh and healthy quinoa salad with Mediterranean flavors',
      photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Quinoa', amount: '1 cup' },
        { name: 'Cherry tomatoes', amount: '1 cup halved' },
        { name: 'Cucumber', amount: '1 medium diced' },
        { name: 'Red onion', amount: '1/4 cup diced' },
        { name: 'Kalamata olives', amount: '1/2 cup pitted' },
        { name: 'Feta cheese', amount: '1/2 cup crumbled' },
        { name: 'Olive oil', amount: '1/4 cup' },
        { name: 'Lemon juice', amount: '3 tbsp' },
        { name: 'Fresh oregano', amount: '1 tbsp chopped' }
      ],
      instructions: [
        { step: 1, description: 'Cook quinoa according to package directions and let cool' },
        { step: 2, description: 'In a large bowl, combine quinoa with tomatoes, cucumber, and onion' },
        { step: 3, description: 'Add olives and feta cheese' },
        { step: 4, description: 'Whisk together olive oil, lemon juice, and oregano' },
        { step: 5, description: 'Pour dressing over salad and toss gently' },
        { step: 6, description: 'Season with salt and pepper to taste' }
      ],
      prepTime: 20,
      cookTime: 15,
      difficulty: 'Easy',
      category: 'Salad',
      createdBy: users[1]._id
    },
    {
      name: 'Chocolate Lava Cake',
      description: 'Decadent chocolate lava cake with molten center',
      photo: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Dark chocolate', amount: '4 oz chopped' },
        { name: 'Butter', amount: '1/2 cup' },
        { name: 'Eggs', amount: '2 large' },
        { name: 'Egg yolks', amount: '2 large' },
        { name: 'Sugar', amount: '1/4 cup' },
        { name: 'All-purpose flour', amount: '2 tbsp' },
        { name: 'Vanilla extract', amount: '1 tsp' },
        { name: 'Powdered sugar', amount: 'for dusting' }
      ],
      instructions: [
        { step: 1, description: 'Preheat oven to 425°F' },
        { step: 2, description: 'Melt chocolate and butter in a double boiler' },
        { step: 3, description: 'Beat eggs, yolks, and sugar until thick and pale' },
        { step: 4, description: 'Fold in melted chocolate mixture' },
        { step: 5, description: 'Sift in flour and add vanilla' },
        { step: 6, description: 'Pour into greased ramekins and bake 12-14 minutes' },
        { step: 7, description: 'Let rest 1 minute, then invert onto plates' },
        { step: 8, description: 'Dust with powdered sugar and serve immediately' }
      ],
      prepTime: 20,
      cookTime: 14,
      difficulty: 'Hard',
      category: 'Dessert',
      createdBy: users[1]._id
    },
    {
      name: 'Beef Stir Fry',
      description: 'Quick and flavorful beef stir fry with fresh vegetables',
      photo: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Beef sirloin', amount: '1 lb sliced thin' },
        { name: 'Broccoli florets', amount: '2 cups' },
        { name: 'Bell peppers', amount: '2 sliced' },
        { name: 'Carrots', amount: '1 cup sliced' },
        { name: 'Soy sauce', amount: '3 tbsp' },
        { name: 'Garlic', amount: '3 cloves minced' },
        { name: 'Ginger', amount: '1 tbsp grated' },
        { name: 'Sesame oil', amount: '1 tbsp' },
        { name: 'Vegetable oil', amount: '2 tbsp' },
        { name: 'Cornstarch', amount: '1 tbsp' }
      ],
      instructions: [
        { step: 1, description: 'Marinate beef with soy sauce and cornstarch for 15 minutes' },
        { step: 2, description: 'Heat vegetable oil in a large wok or skillet' },
        { step: 3, description: 'Stir fry beef until browned, remove and set aside' },
        { step: 4, description: 'Add vegetables and stir fry for 3-4 minutes' },
        { step: 5, description: 'Add garlic and ginger, cook for 1 minute' },
        { step: 6, description: 'Return beef to pan with sesame oil' },
        { step: 7, description: 'Toss everything together and serve over rice' }
      ],
      prepTime: 20,
      cookTime: 10,
      difficulty: 'Medium',
      category: 'Main Course',
      createdBy: users[2]._id
    },
    {
      name: 'Acai Bowl',
      description: 'Healthy and refreshing acai bowl with fresh toppings',
      photo: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Acai puree', amount: '2 packets frozen' },
        { name: 'Banana', amount: '1 medium' },
        { name: 'Mixed berries', amount: '1/2 cup' },
        { name: 'Granola', amount: '1/4 cup' },
        { name: 'Coconut flakes', amount: '2 tbsp' },
        { name: 'Chia seeds', amount: '1 tbsp' },
        { name: 'Almond butter', amount: '1 tbsp' },
        { name: 'Honey', amount: '1 tbsp' }
      ],
      instructions: [
        { step: 1, description: 'Blend acai puree with half banana until smooth' },
        { step: 2, description: 'Pour acai mixture into a bowl' },
        { step: 3, description: 'Top with sliced banana and mixed berries' },
        { step: 4, description: 'Sprinkle with granola and coconut flakes' },
        { step: 5, description: 'Add chia seeds and drizzle with almond butter' },
        { step: 6, description: 'Drizzle with honey and serve immediately' }
      ],
      prepTime: 10,
      cookTime: 0,
      difficulty: 'Easy',
      category: 'Breakfast',
      createdBy: users[2]._id
    },
    {
      name: 'Creamy Mushroom Pasta',
      description: 'Rich and creamy mushroom pasta with herbs',
      photo: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Pasta', amount: '12 oz' },
        { name: 'Mixed mushrooms', amount: '1 lb sliced' },
        { name: 'Heavy cream', amount: '1 cup' },
        { name: 'Parmesan cheese', amount: '1/2 cup grated' },
        { name: 'Garlic', amount: '4 cloves minced' },
        { name: 'White wine', amount: '1/4 cup' },
        { name: 'Fresh thyme', amount: '2 tbsp' },
        { name: 'Olive oil', amount: '2 tbsp' },
        { name: 'Salt and pepper', amount: 'to taste' }
      ],
      instructions: [
        { step: 1, description: 'Cook pasta according to package directions' },
        { step: 2, description: 'Heat olive oil in a large pan over medium heat' },
        { step: 3, description: 'Add mushrooms and cook until golden brown' },
        { step: 4, description: 'Add garlic and thyme, cook for 1 minute' },
        { step: 5, description: 'Deglaze with white wine and reduce by half' },
        { step: 6, description: 'Add cream and bring to a simmer' },
        { step: 7, description: 'Stir in parmesan cheese until melted' },
        { step: 8, description: 'Toss with cooked pasta and season to taste' }
      ],
      prepTime: 15,
      cookTime: 20,
      difficulty: 'Medium',
      category: 'Main Course',
      createdBy: users[0]._id
    },
    {
      name: 'Green Smoothie Bowl',
      description: 'Nutritious green smoothie bowl packed with vitamins',
      photo: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Spinach', amount: '2 cups fresh' },
        { name: 'Mango', amount: '1 cup frozen' },
        { name: 'Banana', amount: '1 medium' },
        { name: 'Almond milk', amount: '1/2 cup' },
        { name: 'Chia seeds', amount: '1 tbsp' },
        { name: 'Coconut flakes', amount: '2 tbsp' },
        { name: 'Mixed berries', amount: '1/4 cup' },
        { name: 'Pumpkin seeds', amount: '1 tbsp' }
      ],
      instructions: [
        { step: 1, description: 'Blend spinach, mango, banana, and almond milk until smooth' },
        { step: 2, description: 'Pour smoothie into a bowl' },
        { step: 3, description: 'Top with chia seeds and coconut flakes' },
        { step: 4, description: 'Add mixed berries and pumpkin seeds' },
        { step: 5, description: 'Serve immediately while cold' }
      ],
      prepTime: 10,
      cookTime: 0,
      difficulty: 'Easy',
      category: 'Breakfast',
      createdBy: users[1]._id
    },
    {
      name: 'Chicken Tikka Masala',
      description: 'Creamy and flavorful Indian curry with tender chicken',
      photo: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Chicken breast', amount: '1 lb cubed' },
        { name: 'Greek yogurt', amount: '1/2 cup' },
        { name: 'Garam masala', amount: '2 tbsp' },
        { name: 'Garlic', amount: '4 cloves minced' },
        { name: 'Ginger', amount: '1 tbsp grated' },
        { name: 'Tomato puree', amount: '1 can' },
        { name: 'Heavy cream', amount: '1/2 cup' },
        { name: 'Onion', amount: '1 medium diced' },
        { name: 'Cumin', amount: '1 tsp' },
        { name: 'Paprika', amount: '1 tsp' }
      ],
      instructions: [
        { step: 1, description: 'Marinate chicken in yogurt, garam masala, garlic, and ginger for 30 minutes' },
        { step: 2, description: 'Cook chicken until golden brown, set aside' },
        { step: 3, description: 'Sauté onion until soft' },
        { step: 4, description: 'Add spices and cook for 1 minute' },
        { step: 5, description: 'Add tomato puree and simmer for 10 minutes' },
        { step: 6, description: 'Add cream and return chicken to pan' },
        { step: 7, description: 'Simmer for 15 minutes until chicken is cooked through' }
      ],
      prepTime: 30,
      cookTime: 30,
      difficulty: 'Medium',
      category: 'Main Course',
      createdBy: users[3]._id
    },
    {
      name: 'Avocado Toast',
      description: 'Simple and healthy avocado toast with various toppings',
      photo: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Bread', amount: '4 slices' },
        { name: 'Avocado', amount: '2 large ripe' },
        { name: 'Lemon juice', amount: '1 tbsp' },
        { name: 'Salt', amount: 'to taste' },
        { name: 'Black pepper', amount: 'to taste' },
        { name: 'Red pepper flakes', amount: '1/2 tsp' },
        { name: 'Cherry tomatoes', amount: '1/2 cup halved' },
        { name: 'Fresh basil', amount: '2 tbsp' }
      ],
      instructions: [
        { step: 1, description: 'Toast bread until golden brown' },
        { step: 2, description: 'Mash avocado with lemon juice, salt, and pepper' },
        { step: 3, description: 'Spread mashed avocado on toast' },
        { step: 4, description: 'Top with cherry tomatoes and fresh basil' },
        { step: 5, description: 'Sprinkle with red pepper flakes' },
        { step: 6, description: 'Serve immediately' }
      ],
      prepTime: 10,
      cookTime: 5,
      difficulty: 'Easy',
      category: 'Breakfast',
      createdBy: users[0]._id
    },
    {
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
      photo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Pizza dough', amount: '1 lb' },
        { name: 'San Marzano tomatoes', amount: '1 can crushed' },
        { name: 'Fresh mozzarella', amount: '8 oz sliced' },
        { name: 'Fresh basil', amount: '1/2 cup leaves' },
        { name: 'Olive oil', amount: '3 tbsp' },
        { name: 'Garlic', amount: '2 cloves minced' },
        { name: 'Salt', amount: '1 tsp' },
        { name: 'Parmesan cheese', amount: '1/4 cup grated' }
      ],
      instructions: [
        { step: 1, description: 'Preheat oven to 500°F with pizza stone' },
        { step: 2, description: 'Roll out pizza dough on floured surface' },
        { step: 3, description: 'Mix crushed tomatoes with garlic, salt, and 1 tbsp olive oil' },
        { step: 4, description: 'Spread tomato sauce on dough' },
        { step: 5, description: 'Top with mozzarella slices' },
        { step: 6, description: 'Bake for 10-12 minutes until crust is golden' },
        { step: 7, description: 'Top with fresh basil and drizzle with olive oil' }
      ],
      prepTime: 20,
      cookTime: 12,
      difficulty: 'Medium',
      category: 'Main Course',
      createdBy: users[2]._id
    },
    {
      name: 'Chocolate Chip Cookies',
      description: 'Soft and chewy chocolate chip cookies',
      photo: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'All-purpose flour', amount: '2 1/4 cups' },
        { name: 'Baking soda', amount: '1 tsp' },
        { name: 'Salt', amount: '1 tsp' },
        { name: 'Butter', amount: '1 cup softened' },
        { name: 'Brown sugar', amount: '3/4 cup' },
        { name: 'White sugar', amount: '1/2 cup' },
        { name: 'Eggs', amount: '2 large' },
        { name: 'Vanilla extract', amount: '2 tsp' },
        { name: 'Chocolate chips', amount: '2 cups' }
      ],
      instructions: [
        { step: 1, description: 'Preheat oven to 375°F' },
        { step: 2, description: 'Mix flour, baking soda, and salt in a bowl' },
        { step: 3, description: 'Cream butter and both sugars until fluffy' },
        { step: 4, description: 'Beat in eggs one at a time, then vanilla' },
        { step: 5, description: 'Gradually blend in flour mixture' },
        { step: 6, description: 'Stir in chocolate chips' },
        { step: 7, description: 'Drop rounded tablespoons onto ungreased cookie sheets' },
        { step: 8, description: 'Bake 9-11 minutes until golden brown' }
      ],
      prepTime: 20,
      cookTime: 11,
      difficulty: 'Easy',
      category: 'Dessert',
      createdBy: users[1]._id
    },
    {
      name: 'Caesar Salad',
      description: 'Classic Caesar salad with homemade croutons',
      photo: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Romaine lettuce', amount: '2 heads' },
        { name: 'Parmesan cheese', amount: '1/2 cup grated' },
        { name: 'Croutons', amount: '1 cup' },
        { name: 'Anchovy fillets', amount: '2 pieces' },
        { name: 'Garlic', amount: '2 cloves' },
        { name: 'Lemon juice', amount: '2 tbsp' },
        { name: 'Dijon mustard', amount: '1 tsp' },
        { name: 'Olive oil', amount: '1/4 cup' }
      ],
      instructions: [
        { step: 1, description: 'Wash and chop romaine lettuce into bite-sized pieces' },
        { step: 2, description: 'Make dressing by blending anchovies, garlic, lemon juice, and mustard' },
        { step: 3, description: 'Slowly drizzle in olive oil while blending' },
        { step: 4, description: 'Toss lettuce with dressing' },
        { step: 5, description: 'Add croutons and parmesan cheese' },
        { step: 6, description: 'Serve immediately' }
      ],
      prepTime: 20,
      cookTime: 0,
      difficulty: 'Medium',
      category: 'Salad',
      createdBy: users[1]._id
    },
    {
      name: 'Greek Yogurt Parfait',
      description: 'Healthy breakfast parfait with berries and granola',
      photo: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Greek yogurt', amount: '2 cups' },
        { name: 'Mixed berries', amount: '1 cup' },
        { name: 'Granola', amount: '1/2 cup' },
        { name: 'Honey', amount: '2 tbsp' },
        { name: 'Chia seeds', amount: '1 tbsp' },
        { name: 'Almonds', amount: '2 tbsp chopped' }
      ],
      instructions: [
        { step: 1, description: 'Layer half the yogurt in a glass' },
        { step: 2, description: 'Add half the berries on top' },
        { step: 3, description: 'Sprinkle with half the granola' },
        { step: 4, description: 'Repeat layers' },
        { step: 5, description: 'Drizzle with honey' },
        { step: 6, description: 'Top with chia seeds and almonds' }
      ],
      prepTime: 10,
      cookTime: 0,
      difficulty: 'Easy',
      category: 'Breakfast',
      createdBy: users[2]._id
    },
    {
      name: 'Fish Tacos',
      description: 'Fresh and flavorful fish tacos with cabbage slaw',
      photo: 'https://images.unsplash.com/photo-1565299585323-38174c4aebba?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'White fish fillets', amount: '1 lb' },
        { name: 'Corn tortillas', amount: '8 small' },
        { name: 'Cabbage', amount: '2 cups shredded' },
        { name: 'Lime juice', amount: '3 tbsp' },
        { name: 'Cilantro', amount: '1/4 cup chopped' },
        { name: 'Red onion', amount: '1/4 cup diced' },
        { name: 'Avocado', amount: '1 sliced' },
        { name: 'Sour cream', amount: '1/2 cup' },
        { name: 'Cumin', amount: '1 tsp' },
        { name: 'Paprika', amount: '1 tsp' }
      ],
      instructions: [
        { step: 1, description: 'Season fish with cumin, paprika, salt, and pepper' },
        { step: 2, description: 'Cook fish in a pan until flaky, about 4-5 minutes per side' },
        { step: 3, description: 'Mix cabbage with lime juice, cilantro, and red onion for slaw' },
        { step: 4, description: 'Warm tortillas in a dry pan' },
        { step: 5, description: 'Flake fish and divide among tortillas' },
        { step: 6, description: 'Top with slaw, avocado slices, and sour cream' }
      ],
      prepTime: 20,
      cookTime: 10,
      difficulty: 'Easy',
      category: 'Main Course',
      createdBy: users[3]._id
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers',
      photo: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Ladyfingers', amount: '24 pieces' },
        { name: 'Mascarpone cheese', amount: '16 oz' },
        { name: 'Heavy cream', amount: '1 cup' },
        { name: 'Egg yolks', amount: '4 large' },
        { name: 'Sugar', amount: '1/2 cup' },
        { name: 'Coffee', amount: '1 cup strong' },
        { name: 'Kahlua', amount: '2 tbsp' },
        { name: 'Cocoa powder', amount: 'for dusting' }
      ],
      instructions: [
        { step: 1, description: 'Beat egg yolks with sugar until thick and pale' },
        { step: 2, description: 'Fold in mascarpone cheese' },
        { step: 3, description: 'Whip heavy cream until stiff peaks form' },
        { step: 4, description: 'Fold whipped cream into mascarpone mixture' },
        { step: 5, description: 'Mix coffee with Kahlua' },
        { step: 6, description: 'Dip ladyfingers in coffee mixture' },
        { step: 7, description: 'Layer ladyfingers and cream mixture in dish' },
        { step: 8, description: 'Chill for 4 hours, dust with cocoa powder before serving' }
      ],
      prepTime: 30,
      cookTime: 0,
      difficulty: 'Hard',
      category: 'Dessert',
      createdBy: users[0]._id
    },
    {
      name: 'Ramen Bowl',
      description: 'Rich and flavorful Japanese ramen with soft-boiled egg',
      photo: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&crop=center',
      ingredients: [
        { name: 'Ramen noodles', amount: '2 packages' },
        { name: 'Pork belly', amount: '8 oz sliced' },
        { name: 'Soft-boiled eggs', amount: '2 eggs' },
        { name: 'Green onions', amount: '2 stalks chopped' },
        { name: 'Bean sprouts', amount: '1/2 cup' },
        { name: 'Nori sheets', amount: '2 sheets' },
        { name: 'Miso paste', amount: '3 tbsp' },
        { name: 'Soy sauce', amount: '2 tbsp' },
        { name: 'Garlic', amount: '2 cloves minced' },
        { name: 'Ginger', amount: '1 tbsp grated' }
      ],
      instructions: [
        { step: 1, description: 'Cook pork belly until crispy, set aside' },
        { step: 2, description: 'Sauté garlic and ginger in a large pot' },
        { step: 3, description: 'Add miso paste and cook for 1 minute' },
        { step: 4, description: 'Add soy sauce and 4 cups water, bring to boil' },
        { step: 5, description: 'Cook ramen noodles according to package directions' },
        { step: 6, description: 'Divide noodles among bowls' },
        { step: 7, description: 'Top with broth, pork belly, egg, and vegetables' },
        { step: 8, description: 'Garnish with nori and green onions' }
      ],
      prepTime: 25,
      cookTime: 20,
      difficulty: 'Medium',
      category: 'Main Course',
      createdBy: users[2]._id
    }
  ];

  // Clear existing recipes
  await Recipe.deleteMany({});
  
  const createdRecipes = await Recipe.insertMany(recipes);
  console.log(`✅ Created ${createdRecipes.length} recipes with photos`);
  return createdRecipes;
}

async function seedMealPlans(users, recipes) {
  console.log('📅 Seeding meal plans...');
  
  const mealPlans = [
    {
      name: 'Healthy Week',
      description: 'A week of nutritious and balanced meals',
      recipes: [],
      createdBy: users[0]._id
    },
    {
      name: 'Weekend Treats',
      description: 'Special meals for relaxing weekends',
      recipes: [],
      createdBy: users[1]._id
    }
  ];

  // Clear existing meal plans
  await MealPlan.deleteMany({});
  
  const createdMealPlans = await MealPlan.insertMany(mealPlans);
  console.log(`✅ Created ${createdMealPlans.length} meal plans`);
  return createdMealPlans;
}

async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('🚀 Starting database seeding...');
    
    const users = await seedUsers();
    const recipes = await seedRecipes(users);
    const mealPlans = await seedMealPlans(users, recipes);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🍽️ Recipes: ${recipes.length} (with photos)`);
    console.log(`   📅 Meal Plans: ${mealPlans.length}`);
    console.log('\n🔑 Sample login credentials:');
    console.log('   📧 Email: admin@example.com, 🔑 Password: password123');
    console.log('   📧 Email: john@example.com, 🔑 Password: password123');
    console.log('   📧 Email: jane@example.com, 🔑 Password: password123');
    console.log('   📧 Email: mike@example.com, 🔑 Password: password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();

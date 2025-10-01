# Meal Planner Web App

A modern, full-stack meal planning application built with Next.js, MongoDB, and Tailwind CSS featuring a beautiful warm and fresh design.

## Features

### 🍳 Complete Recipe CRUD System
- **Create**: Add new recipes with a comprehensive form (ingredients, instructions, photos, cooking times)
- **Read**: Browse recipes in beautiful card grid layouts with filtering
- **Update**: Edit recipes with pre-populated forms and instant updates
- **Delete**: Remove recipes safely with confirmation dialogs
- **Dedicated Management Page**: Full-featured `/manage-recipes` interface
- **Recipe Details**: View complete recipe information on dedicated pages

### 🔐 User Authentication
- Secure login and registration with NextAuth
- Session-based authentication for all API endpoints
- User-specific recipe ownership and permissions

### 📅 Meal Planning
- Create multiple meal plans and organize recipes by meal type
- Add/remove recipes from meal plans
- Visual card-based layout with chronological ordering

### 🎨 Modern UI/UX
- **Warm & Fresh Design**: Beautiful gradient backgrounds with warm orange, amber, and green accents
- **Glassmorphism Effects**: Modern glass-like cards with backdrop blur
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Components**: Hover effects, smooth animations, loading states
- **Custom Components**: Built with Headless UI for accessibility

### 💾 Data Management
- MongoDB integration with Mongoose ODM
- Schema validation on both frontend and backend
- Default admin account for testing (`admin@example.com` / `password123`)

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Headless UI
- **Backend**: Next.js API Routes, NextAuth
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth with credentials provider
- **UI Components**: Custom components with Headless UI and Heroicons

## Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meal-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/meal-planner
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

**Default Login Credentials:**
- Email: `admin@example.com`
- Password: `password123`

4. Start MongoDB:
Make sure MongoDB is running on your system. If using a local instance:
```bash
mongod
```

5. Seed the database with sample data:
```bash
npm run seed
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build production bundle
npm run start    # Start production server
npm run seed     # Seed database with sample data
npm run clear    # Clear all data from database
npm run lint     # Run ESLint
```

## Usage

### Getting Started

1. **Register/Login**: Create a new account or sign in with existing credentials
2. **Create Recipes**: Add your favorite recipes with ingredients, instructions, and cooking details
3. **Plan Meals**: Create meal plans and assign recipes to specific days and meal types
4. **Manage Plans**: Edit, delete, or create new meal plans as needed

### Features Overview

#### Recipe Management (Full CRUD)
- **Create**: Add detailed recipes with ingredients and step-by-step instructions via modal form
- **Read**: View all recipes in a beautiful card-based grid layout with filtering options
- **Update**: Edit existing recipes with pre-populated form data
- **Delete**: Remove recipes with confirmation dialog to prevent accidental deletion
- Set prep time, cook time, servings, and difficulty level
- Categorize recipes for easy organization (Italian, Dessert, Main Course, etc.)
- Upload recipe photos via URL (with fallback placeholder images)
- Dynamic ingredient and instruction management (add/remove fields)
- Real-time validation and error handling
- Separate "Manage Recipes" page for dedicated recipe management
- View detailed recipe page with full information display

#### Meal Planning
- Create multiple meal plans (e.g., "Weekly Family Meals", "Healthy Week")
- Assign recipes to meal types (Breakfast, Lunch, Dinner, Snack)
- Add or remove recipes from meal plans
- Chronological ordering (oldest to newest)
- Visual card-based layout

#### User Interface
- **Warm & Fresh Design**: Beautiful gradient backgrounds with warm orange, amber, and green accents
- **Glassmorphism Effects**: Modern glass-like cards with backdrop blur
- **Responsive Layout**: Works perfectly on all devices
- **Intuitive Navigation**: Tab-based interface for easy switching between recipes and meal plans
- **Custom Components**: Built with Headless UI for accessibility and modern interactions
- **Loading States**: Elegant loading animations with warm color scheme

### Recipe CRUD Operations

The application provides a complete recipe management system with full CRUD (Create, Read, Update, Delete) functionality:

#### Creating Recipes
1. Navigate to "Manage Recipes" from the dashboard
2. Click the "Create Recipe" button
3. Fill in the recipe form with:
   - **Basic Info**: Name, category, description
   - **Cooking Details**: Difficulty level, prep time, cook time
   - **Photo**: Optional image URL
   - **Ingredients**: Add multiple ingredients with amounts (dynamically add/remove)
   - **Instructions**: Step-by-step cooking instructions (numbered automatically)
4. Form validation ensures all required fields are completed
5. Submit to create the recipe

#### Reading Recipes
- **Manage Recipes Page**: Grid view of all your recipes with cards showing:
  - Recipe photo (with fallback for missing images)
  - Recipe name and description
  - Category, difficulty, and total time badges
  - Creation date
- **Recipe Details Page**: Click "View Details" to see complete recipe information
- **Dashboard Integration**: Browse all recipes in the Recipes tab

#### Updating Recipes
1. Navigate to "Manage Recipes"
2. Hover over a recipe card to reveal action buttons
3. Click the edit (pencil) icon
4. Form opens pre-populated with existing recipe data
5. Modify any fields as needed
6. Submit to update the recipe
7. Changes are immediately reflected

#### Deleting Recipes
1. Navigate to "Manage Recipes"
2. Hover over a recipe card to reveal action buttons
3. Click the delete (trash) icon
4. Confirmation dialog appears to prevent accidental deletion
5. Confirm to permanently delete the recipe
6. Recipe is removed from your collection

#### Form Features
- **Dynamic Fields**: Add/remove ingredients and instructions as needed
- **Validation**: Required fields are marked with asterisk (*)
- **Auto-numbering**: Instruction steps are automatically numbered
- **Image Preview**: Recipe photos are displayed in the form
- **Error Handling**: Clear error messages for failed operations
- **Loading States**: Visual feedback during save operations
- **Responsive Design**: Works seamlessly on all screen sizes

## Project Structure

```
meal-planner/
├── app/                    # Next.js app directory
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── pages/                  # Pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   │   ├── [...nextauth].js  # NextAuth config
│   │   │   └── register.js       # User registration
│   │   ├── recipes/       # Recipe CRUD operations
│   │   │   ├── index.js   # GET (all recipes), POST (create)
│   │   │   └── [id].js    # GET, PUT, DELETE (single recipe)
│   │   └── meal-plans/    # Meal plan CRUD operations
│   │       ├── index.js   # GET (all plans), POST (create)
│   │       ├── [id].js    # GET, PUT, DELETE (single plan)
│   │       └── [id]/recipes/  # Add/remove recipes from plans
│   ├── recipe/            # Recipe detail pages
│   │   └── [id].js        # Individual recipe view
│   ├── login.js           # Login/registration page
│   ├── dashboard.js       # Main dashboard with tabs
│   └── manage-recipes.js  # Dedicated recipe management page
├── components/             # Custom UI components
│   ├── CustomButton.js    # Button component with warm styling
│   ├── CustomInput.js     # Input component with glassmorphism
│   ├── CustomSelect.js    # Select dropdown with Headless UI
│   ├── CustomTextarea.js  # Textarea component
│   ├── RecipeFormDialog.js # Modal for creating/editing recipes
│   ├── AddRecipeDialog.js # Legacy dialog (deprecated)
│   ├── DeleteConfirmDialog.js # Confirmation dialog
│   └── RecipeImage.js     # Image component with fallback
├── models/                # Mongoose data models
│   ├── User.js            # User schema
│   ├── Recipe.js          # Recipe schema
│   └── MealPlan.js        # Meal plan schema
├── lib/                   # Utility functions
│   └── mongodb.js         # MongoDB connection
├── scripts/               # Database seeding scripts
│   ├── seedData.js        # Seed sample data
│   └── clearData.js       # Clear database
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth configuration

### Recipes (CRUD Operations)

#### GET `/api/recipes`
Retrieve recipes for the authenticated user.
- **Query Parameters**: 
  - `all=true` - Get all recipes (for dashboard recipes tab)
  - Default - Get only user's recipes (for manage recipes page)
- **Response**: Array of recipe objects
- **Auth**: Required (session-based)

#### POST `/api/recipes`
Create a new recipe.
- **Request Body**:
  ```json
  {
    "name": "Recipe Name",
    "description": "Recipe description",
    "category": "Italian",
    "difficulty": "Easy",
    "prepTime": 15,
    "cookTime": 30,
    "photo": "https://example.com/image.jpg",
    "ingredients": [
      { "name": "Ingredient 1", "amount": "2 cups" }
    ],
    "instructions": [
      { "step": 1, "description": "First step..." }
    ]
  }
  ```
- **Response**: Created recipe object
- **Auth**: Required (user ID from session)

#### GET `/api/recipes/[id]`
Get a specific recipe by ID.
- **Response**: Single recipe object
- **Auth**: Required (must be recipe owner)

#### PUT `/api/recipes/[id]`
Update an existing recipe.
- **Request Body**: Same as POST (all fields or partial update)
- **Response**: Updated recipe object
- **Auth**: Required (must be recipe owner)

#### DELETE `/api/recipes/[id]`
Delete a recipe permanently.
- **Response**: `{ "message": "Recipe deleted successfully" }`
- **Auth**: Required (must be recipe owner)

### Meal Plans
- `GET /api/meal-plans` - Get all user meal plans
- `POST /api/meal-plans` - Create new meal plan
- `GET /api/meal-plans/[id]` - Get specific meal plan
- `PUT /api/meal-plans/[id]` - Update meal plan
- `DELETE /api/meal-plans/[id]` - Delete meal plan
- `POST /api/meal-plans/[id]/recipes` - Add recipe to meal plan
- `DELETE /api/meal-plans/[id]/recipes/[recipeId]` - Remove recipe from meal plan

## Data Models

### User
- `name` (String, required) - User's full name
- `email` (String, required, unique) - User email for authentication
- `password` (String, required, hashed) - Encrypted password
- `createdAt` (Date) - Account creation timestamp

### Recipe (Full Schema)
```javascript
{
  name: String (required),              // Recipe name
  description: String (required),       // Recipe description
  category: String (required),          // e.g., "Italian", "Dessert"
  difficulty: String (required),        // "Easy", "Medium", or "Hard"
  prepTime: Number (default: 0),        // Preparation time in minutes
  cookTime: Number (default: 0),        // Cooking time in minutes
  servings: Number (default: 1),        // Number of servings
  photo: String (default: ''),          // Recipe image URL
  ingredients: [                        // Array of ingredients
    {
      name: String (required),          // Ingredient name
      amount: String (required)         // Amount/measurement
    }
  ],
  instructions: [                       // Array of cooking steps
    {
      step: Number (required),          // Step number
      description: String (required)    // Step description
    }
  ],
  createdBy: ObjectId (required),       // Reference to User
  createdAt: Date (default: now)        // Creation timestamp
}
```

**Key Features**:
- Nested arrays for ingredients and instructions
- Automatic timestamp management
- User ownership via `createdBy` reference
- Validation on difficulty enum values
- Support for both `photo` and `image` fields (legacy compatibility)

### MealPlan
- `name` (String, required) - Meal plan name
- `description` (String) - Plan description
- `recipes` (Array) - Array of recipe assignments:
  - `recipe` (ObjectId) - Reference to Recipe
  - `mealType` (String) - "Breakfast", "Lunch", "Dinner", "Snack"
- `createdBy` (ObjectId, required) - Reference to User
- `createdAt` (Date) - Creation timestamp
- `updatedAt` (Date) - Last update timestamp

## Design System

### Color Palette
The application features a warm and fresh color scheme designed for modern, inviting user experiences:

- **Primary Background**: Light slate gradient (`#f8fafc` → `#e2e8f0` → `#cbd5e1`)
- **Primary Actions**: Warm amber (`#f59e0b`) with orange accents (`#f97316`)
- **Success Actions**: Fresh emerald (`#10b981`)
- **Danger Actions**: Clear red (`#ef4444`)
- **Secondary Elements**: Light slate (`#cbd5e1`) with subtle transparency

### UI Components
- **Glassmorphism Cards**: Semi-transparent white backgrounds with backdrop blur
- **Custom Form Elements**: Built with Headless UI for accessibility
- **Warm Loading States**: Amber spinners with slate borders
- **Responsive Design**: Mobile-first approach with smooth animations

### Typography
- **Headings**: Slate-800 to Slate-600 gradients for depth
- **Body Text**: Slate-700 for optimal readability
- **Muted Text**: Slate-600 for secondary information

## Technical Implementation: Recipe CRUD

### Frontend Components
- **`RecipeFormDialog.js`**: Reusable modal form for create/edit operations
  - Dynamic ingredient/instruction fields
  - Form validation with real-time feedback
  - Pre-population for edit mode
  - Headless UI Dialog for accessibility
  
- **`manage-recipes.js`**: Dedicated recipe management page
  - Grid layout with responsive cards
  - Hover animations revealing action buttons
  - Empty state with call-to-action
  - Integration with all CRUD operations

- **`RecipeImage.js`**: Smart image component
  - Graceful fallback for missing images
  - Optimized loading with error handling
  
- **`DeleteConfirmDialog.js`**: Confirmation modal
  - Prevents accidental deletions
  - Reusable across all delete operations

### Backend API
- **Session-based authentication**: All endpoints require valid NextAuth session
- **User ownership validation**: Users can only modify their own recipes
- **MongoDB integration**: Mongoose models with schema validation
- **Error handling**: Comprehensive error responses with status codes
- **Population**: Automatic user data population with `createdBy` field

### Key Features
1. **Real-time Updates**: UI refreshes immediately after CRUD operations
2. **Optimistic UI**: Loading states provide instant feedback
3. **Data Validation**: 
   - Frontend: Form validation before submission
   - Backend: Mongoose schema validation
4. **Security**:
   - Authentication required for all operations
   - User can only access/modify own recipes
   - Input sanitization and validation
5. **User Experience**:
   - Smooth animations and transitions
   - Hover effects for discoverability
   - Toast notifications for success/error states
   - Responsive design for all screen sizes

## Quick Start Guide: Recipe CRUD

To get started with recipe management:

1. **Login**: Use default credentials (`admin@example.com` / `password123`) or create a new account

2. **Access Recipe Management**:
   - From dashboard, click "Manage Recipes" button, OR
   - Navigate directly to `/manage-recipes` page

3. **Create Your First Recipe**:
   ```
   a. Click "Create Recipe" button
   b. Enter recipe name (e.g., "Spaghetti Carbonara")
   c. Select category and difficulty
   d. Add ingredients: Click "Add Ingredient" for each ingredient
   e. Add instructions: Click "Add Step" for each step
   f. Optional: Add photo URL for recipe image
   g. Click "Create Recipe" to save
   ```

4. **View Recipes**:
   - Recipe cards display in a responsive grid
   - Each card shows: photo, name, description, category, difficulty, total time
   - Hover over cards to reveal edit/delete actions

5. **Edit a Recipe**:
   ```
   a. Hover over recipe card
   b. Click the pencil (edit) icon
   c. Modify any fields in the pre-populated form
   d. Click "Update Recipe" to save changes
   ```

6. **Delete a Recipe**:
   ```
   a. Hover over recipe card
   b. Click the trash (delete) icon
   c. Confirm deletion in the dialog
   d. Recipe is permanently removed
   ```

7. **View Recipe Details**:
   - Click "View Details" on any recipe card
   - See full recipe information including all ingredients and instructions

### Testing Recipe CRUD

To test the complete CRUD functionality:
```bash
# Create a test recipe via API
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Recipe",
    "description": "A test recipe",
    "category": "Test",
    "difficulty": "Easy",
    "ingredients": [{"name": "Test", "amount": "1 cup"}],
    "instructions": [{"step": 1, "description": "Test step"}]
  }'

# Get all recipes
curl http://localhost:3000/api/recipes

# Update a recipe (replace {id} with actual recipe ID)
curl -X PUT http://localhost:3000/api/recipes/{id} \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Recipe Name"}'

# Delete a recipe
curl -X DELETE http://localhost:3000/api/recipes/{id}
```

## Troubleshooting

### Common Recipe CRUD Issues

**Issue**: "Unauthorized" error when creating recipes
- **Solution**: Ensure you're logged in and have an active session

**Issue**: Recipe form validation fails
- **Solution**: Check that all required fields (marked with *) are filled:
  - Name, description, category, difficulty
  - At least one ingredient with name and amount
  - At least one instruction with description

**Issue**: Recipe image not displaying
- **Solution**: 
  - Verify the image URL is accessible
  - Check if URL uses HTTPS
  - Fallback placeholder will display if image fails to load

**Issue**: Cannot edit/delete recipes created by other users
- **Solution**: This is by design - users can only manage their own recipes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
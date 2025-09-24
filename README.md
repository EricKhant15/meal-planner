# Meal Planner Web App

A modern, full-stack meal planning application built with Next.js, MongoDB, and Tailwind CSS featuring a beautiful warm and fresh design.

## Features

- **User Authentication**: Secure login and registration with NextAuth
- **Recipe Management**: Create, edit, and delete recipes with detailed ingredients and instructions
- **Meal Planning**: Create multiple meal plans and organize recipes by meal type
- **Modern Warm UI**: Clean, responsive design with warm color palette and glassmorphism effects
- **Data Persistence**: MongoDB integration for storing user data, recipes, and meal plans
- **Default Credentials**: Pre-configured admin account for easy testing

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

## Usage

### Getting Started

1. **Register/Login**: Create a new account or sign in with existing credentials
2. **Create Recipes**: Add your favorite recipes with ingredients, instructions, and cooking details
3. **Plan Meals**: Create meal plans and assign recipes to specific days and meal types
4. **Manage Plans**: Edit, delete, or create new meal plans as needed

### Features Overview

#### Recipe Management
- Add detailed recipes with ingredients and step-by-step instructions
- Set prep time, cook time, servings, and difficulty level
- Categorize recipes for easy organization
- Edit or delete existing recipes

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

## Project Structure

```
meal-planner/
├── app/                    # Next.js app directory
├── pages/                  # Pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   ├── recipes/       # Recipe CRUD operations
│   │   └── meal-plans/    # Meal plan CRUD operations
│   ├── login.js           # Login/registration page
│   └── dashboard.js       # Main dashboard with integrated features
├── components/             # Custom UI components
│   ├── CustomButton.js    # Button component with warm styling
│   ├── CustomInput.js     # Input component with glassmorphism
│   ├── CustomSelect.js    # Select dropdown with Headless UI
│   ├── CustomTextarea.js  # Textarea component
│   ├── AddRecipeDialog.js # Modal for adding recipes
│   ├── DeleteConfirmDialog.js # Confirmation dialog
│   └── RecipeImage.js     # Image component with fallback
├── models/                # Mongoose data models
├── lib/                   # Utility functions
├── scripts/               # Database seeding scripts
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth configuration

### Recipes
- `GET /api/recipes` - Get all user recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/[id]` - Get specific recipe
- `PUT /api/recipes/[id]` - Update recipe
- `DELETE /api/recipes/[id]` - Delete recipe

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
- name, email, password
- Created/updated timestamps

### Recipe
- name, description, category, photo
- ingredients (name, amount)
- instructions (step, description)
- prepTime, cookTime, difficulty
- createdBy (user reference)

### MealPlan
- name, description
- recipes (array with recipe reference, mealType)
- createdBy (user reference)
- Created/updated timestamps

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TrashIcon, PlusIcon, PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import CustomButton from '../components/CustomButton';
import RecipeFormDialog from '../components/RecipeFormDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import RecipeImage from '../components/RecipeImage';

export default function ManageRecipes() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userRecipes, setUserRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUserRecipes();
    }
  }, [status, router]);

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setUserRecipes(data);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRecipe = async (recipeData) => {
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        await fetchUserRecipes();
        setShowRecipeForm(false);
        setEditingRecipe(null);
        alert('Recipe created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error creating recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert(`Error creating recipe: ${error.message}`);
    }
  };

  const handleUpdateRecipe = async (recipeData) => {
    try {
      const response = await fetch(`/api/recipes/${editingRecipe._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        await fetchUserRecipes();
        setShowRecipeForm(false);
        setEditingRecipe(null);
        alert('Recipe updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error updating recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert(`Error updating recipe: ${error.message}`);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUserRecipes();
        alert('Recipe deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error deleting recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert(`Error deleting recipe: ${error.message}`);
    }
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeForm(true);
  };

  const handleDeleteRecipeClick = (recipe) => {
    setDeleteItem(recipe);
    setShowDeleteConfirm(true);
  };

  const handleRecipeFormSubmit = async (recipeData) => {
    if (editingRecipe) {
      await handleUpdateRecipe(recipeData);
    } else {
      await handleCreateRecipe(recipeData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteItem) {
      await handleDeleteRecipe(deleteItem._id);
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-amber-500 mx-auto"></div>
          <p className="mt-6 text-slate-800 text-lg">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#f59e0b] to-[#d97706] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-[#f97316] to-[#ea580c] rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-slate-200/50 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <CustomButton
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                size="md"
                className="mr-4"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
              </CustomButton>
              <div className="bg-gradient-to-r from-[#f59e0b] to-[#f97316] p-3 rounded-2xl shadow-xl">
                <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Manage Recipes
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-700 text-lg font-medium">Welcome, {session.user.name}</span>
              <CustomButton
                onClick={() => signOut()}
                variant="danger"
                size="md"
              >
                Sign Out
              </CustomButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-700 bg-clip-text text-transparent mb-2">
                  Your Recipe Collection
                </h2>
                <p className="text-slate-800/70 text-lg">Create, edit, and organize your personal recipe collection 🍳✨</p>
              </div>
              <CustomButton
                onClick={() => {
                  setEditingRecipe(null);
                  setShowRecipeForm(true);
                }}
                variant="primary"
                size="lg"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Recipe
              </CustomButton>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-amber-500 mx-auto"></div>
              <p className="mt-6 text-slate-600 text-lg">Loading your recipes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {userRecipes.map((recipe) => (
                <div key={recipe._id} className="group relative bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <RecipeImage
                      src={recipe.photo}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={() => handleEditRecipe(recipe)}
                        className="bg-white/90 backdrop-blur-sm text-blue-600 hover:text-blue-700 p-2.5 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Edit recipe"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecipeClick(recipe)}
                        className="bg-white/90 backdrop-blur-sm text-red-600 hover:text-red-700 p-2.5 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                        title="Delete recipe"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                        {recipe.name}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                        {recipe.category}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm ${
                        recipe.difficulty === 'Easy' 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : recipe.difficulty === 'Medium'
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                          : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}>
                        {recipe.difficulty}
                      </span>
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm">
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Created {new Date(recipe.createdAt).toLocaleDateString()}</span>
                      <button 
                        onClick={() => router.push(`/recipe/${recipe._id}`)}
                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && userRecipes.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-12">
                <div className="text-6xl mb-4 animate-bounce">🍳✨</div>
                <p className="text-slate-800/70 text-xl mb-6">No recipes found. Let's create your first amazing recipe! 👨‍🍳✨</p>
                <CustomButton
                  onClick={() => {
                    setEditingRecipe(null);
                    setShowRecipeForm(true);
                  }}
                  variant="primary"
                  size="lg"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create Your First Recipe
                </CustomButton>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Recipe Form Dialog */}
      <RecipeFormDialog
        isOpen={showRecipeForm}
        onClose={() => {
          setShowRecipeForm(false);
          setEditingRecipe(null);
        }}
        onSubmit={handleRecipeFormSubmit}
        recipe={editingRecipe}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteItem?.name}
      />
    </div>
  );
}

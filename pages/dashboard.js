import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TrashIcon, XMarkIcon, PlusIcon, CalendarDaysIcon, BookOpenIcon, PencilIcon } from '@heroicons/react/24/outline';
import CustomSelect from '../components/CustomSelect';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import CustomTextarea from '../components/CustomTextarea';
import AddRecipeDialog from '../components/AddRecipeDialog';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import RecipeImage from '../components/RecipeImage';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('meals');
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMealPlan, setEditingMealPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [newRecipeData, setNewRecipeData] = useState({
    recipe: '',
    mealType: 'Breakfast',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchRecipes();
      fetchMealPlans();
    }
  }, [status, router]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const response = await fetch('/api/meal-plans');
      const data = await response.json();
      setMealPlans(data);
      if (data.length > 0 && !selectedMealPlan) {
        setSelectedMealPlan(data[0]);
      }
      return data;
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMealPlan ? `/api/meal-plans/${editingMealPlan._id}` : '/api/meal-plans';
      const method = editingMealPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMealPlans();
        setShowForm(false);
        setEditingMealPlan(null);
        setFormData({ name: '', description: '' });
      }
    } catch (error) {
      console.error('Error saving meal plan:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/meal-plans/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMealPlans();
        if (selectedMealPlan && selectedMealPlan._id === id) {
          setSelectedMealPlan(null);
        }
      }
    } catch (error) {
      console.error('Error deleting meal plan:', error);
    }
  };

  const handleDeleteClick = (mealPlan) => {
    setDeleteItem(mealPlan);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteItem) {
      await handleDelete(deleteItem._id);
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    }
  };

  const handleEdit = (mealPlan) => {
    setEditingMealPlan(mealPlan);
    setFormData({
      name: mealPlan.name,
      description: mealPlan.description,
    });
    setShowForm(true);
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    try {
      console.log('Adding recipe with data:', newRecipeData);
      console.log('Meal plan ID:', selectedMealPlan._id);
      
      const response = await fetch(`/api/meal-plans/${selectedMealPlan._id}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipeData),
      });

      if (response.ok) {
        const updatedMealPlans = await fetchMealPlans();
        if (updatedMealPlans) {
          const updatedSelectedMealPlan = updatedMealPlans.find(mp => mp._id === selectedMealPlan._id);
          if (updatedSelectedMealPlan) {
            setSelectedMealPlan(updatedSelectedMealPlan);
          }
        }
        setShowAddRecipe(false);
        setNewRecipeData({ recipe: '', mealType: 'Breakfast' });
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Error adding recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding recipe to meal plan:', error);
      alert(`Error adding recipe: ${error.message}`);
    }
  };

  const handleRemoveRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/meal-plans/${selectedMealPlan._id}/recipes/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedMealPlans = await fetchMealPlans();
        if (updatedMealPlans) {
          const updatedSelectedMealPlan = updatedMealPlans.find(mp => mp._id === selectedMealPlan._id);
          if (updatedSelectedMealPlan) {
            setSelectedMealPlan(updatedSelectedMealPlan);
          }
        }
      }
    } catch (error) {
      console.error('Error removing recipe from meal plan:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-amber-500 mx-auto"></div>
          <p className="mt-6 text-slate-800 text-lg">Loading your meal planner...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

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
              <div className="bg-gradient-to-r from-[#f59e0b] to-[#f97316] p-3 rounded-2xl shadow-xl">
                <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Meal Planner
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

      {/* Navigation */}
      <nav className="bg-white/20 backdrop-blur-md border-b border-slate-200/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('meals')}
                className={`py-6 px-1 border-b-3 font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'meals'
                    ? 'border-gradient-to-r from-orange-500 to-amber-500 text-slate-800'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-orange-300'
                }`}
            >
              <div className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-5 h-5" />
                <span>Meal Plans</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
                className={`py-6 px-1 border-b-3 font-semibold text-lg transition-all duration-300 ${
                  activeTab === 'recipes'
                    ? 'border-gradient-to-r from-orange-500 to-amber-500 text-slate-800'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-orange-300'
                }`}
            >
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-5 h-5" />
                <span>Recipes</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
        {activeTab === 'recipes' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-700 bg-clip-text text-transparent mb-2">
                Your Recipe Collection
              </h2>
                  <p className="text-slate-800/70 text-lg">Discover and manage your favorite recipes 🍽️✨</p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-amber-500 mx-auto"></div>
                <p className="mt-6 text-slate-600 text-lg">Loading recipes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <div key={recipe._id} className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group hover:bg-white/70 hover:border-slate-300/60">
                    <div className="h-48 overflow-hidden">
                      <RecipeImage
                        src={recipe.photo}
                        alt={recipe.name}
                        className="w-full h-full hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-800">{recipe.name}</h3>
                        <span className="text-xs text-slate-800/60 bg-white/10 px-3 py-1 rounded-full">
                          {recipe.createdBy?.name || 'Unknown'}
                        </span>
                      </div>
                      <p className="text-slate-800/70 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                          {recipe.category}
                        </span>
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                          {recipe.difficulty}
                        </span>
                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                          {recipe.prepTime + recipe.cookTime} min
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!isLoading && recipes.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-12">
                  <div className="text-6xl mb-4 animate-bounce">🍽️✨</div>
                  <p className="text-slate-800/70 text-xl">No recipes found. Let's cook up something amazing! 👨‍🍳✨</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-700 bg-clip-text text-transparent mb-2">
                Meal Planning
              </h2>
              <p className="text-slate-800/70 text-lg">Organize your weekly meals</p>
            </div>

            {/* Create Meal Plan Form */}
            {showForm && (
              <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-8 mb-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold text-slate-800">
                    {editingMealPlan ? 'Edit Meal Plan' : 'Create New Meal Plan'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingMealPlan(null);
                      setFormData({ name: '', description: '' });
                    }}
                    className="text-slate-800/60 hover:text-slate-800 transition-colors p-2 hover:bg-white/10 rounded-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <CustomInput
                    label="Meal Plan Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Weekly Family Meals"
                    required
                  />
                  <CustomTextarea
                    label="Description (Optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Describe your meal plan..."
                  />
                  <div className="flex justify-end space-x-4 pt-4">
                    <CustomButton
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowForm(false);
                        setEditingMealPlan(null);
                        setFormData({ name: '', description: '' });
                      }}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type="submit"
                      variant="primary"
                    >
                      {editingMealPlan ? 'Update' : 'Create'} Meal Plan
                    </CustomButton>
                  </div>
                </form>
              </div>
            )}

            {/* Meal Plans */}
            {mealPlans.length > 0 && (
              <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl mb-8 shadow-2xl">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Meal Plans</h3>
                  <div className="flex flex-wrap gap-4 mb-8">
                    {mealPlans.map((mealPlan) => (
                      <button
                        key={mealPlan._id}
                        onClick={() => setSelectedMealPlan(mealPlan)}
                        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                          selectedMealPlan && selectedMealPlan._id === mealPlan._id
                            ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-slate-800 shadow-xl'
                            : 'bg-white/10 text-slate-800/80 hover:bg-white/20 hover:text-slate-800 backdrop-blur-md border border-white/20'
                        }`}
                      >
                        {mealPlan.name}
                      </button>
                    ))}
                <CustomButton
                  onClick={() => setShowForm(true)}
                  variant="success"
                  size="lg"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  New Plan
                </CustomButton>
                  </div>

                  {selectedMealPlan && (
                    <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-8 mb-8 border border-white/20">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-3xl font-bold text-slate-800 mb-2">{selectedMealPlan.name}</h4>
                          {selectedMealPlan.description && (
                            <p className="text-slate-800/70 text-lg">{selectedMealPlan.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                        <CustomButton
                          onClick={() => setShowAddRecipe(true)}
                          variant="success"
                          size="md"
                        >
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add Recipe
                        </CustomButton>
                          <CustomButton
                            onClick={() => handleEdit(selectedMealPlan)}
                            variant="info"
                            size="md"
                          >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                          </CustomButton>
                          <CustomButton
                            onClick={() => handleDeleteClick(selectedMealPlan)}
                            variant="danger"
                            size="md"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                          </CustomButton>
                        </div>
                      </div>

                      {/* Recipe List */}
                      <div className="space-y-6">
                        <h5 className="text-xl font-bold text-slate-800 mb-4">Recipes in this meal plan</h5>
                        {selectedMealPlan.recipes.length === 0 ? (
                          <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-4xl mb-4 animate-bounce">🍽️✨</div>
                            <p className="text-slate-800/60 text-lg">No recipes added yet. Let's spice things up! 🌶️✨</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedMealPlan.recipes.map((recipeData) => {
                              const recipe = recipes.find((r) => r._id === recipeData.recipe);
                              return recipe ? (
                                <div key={recipeData._id} className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
                                  <div className="h-40 rounded-lg mb-4 overflow-hidden">
                                    <RecipeImage
                                      src={recipe.photo}
                                      alt={recipe.name}
                                      className="w-full h-full hover:scale-110 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="flex justify-between items-start mb-3">
                                    <h6 className="font-bold text-slate-800 text-lg">{recipe.name}</h6>
                                    <button
                                      onClick={() => handleRemoveRecipe(recipeData._id)}
                                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-colors group"
                                      title="Remove recipe"
                                    >
                                      <TrashIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                                      {recipeData.mealType}
                                    </span>
                                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">
                                      {recipe.difficulty}
                                    </span>
                                  </div>
                                  <p className="text-slate-800/70 text-sm line-clamp-2 mb-3">{recipe.description}</p>
                                  <div className="text-xs text-slate-800/50">
                                    {recipe.prepTime + recipe.cookTime} min
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add Recipe Dialog */}
            <AddRecipeDialog
              isOpen={showAddRecipe && selectedMealPlan}
              onClose={() => setShowAddRecipe(false)}
              onSubmit={handleAddRecipe}
              recipes={recipes}
              newRecipeData={newRecipeData}
              setNewRecipeData={setNewRecipeData}
            />

            <DeleteConfirmDialog
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={handleDeleteConfirm}
              itemName={deleteItem?.name}
            />

            {mealPlans.length === 0 && !showForm && (
              <div className="text-center py-16">
                <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 rounded-2xl p-12">
                  <div className="text-6xl mb-4 animate-bounce">📅✨</div>
                  <p className="text-slate-800/70 text-xl mb-6">No meal plans found. Let's create your first amazing meal plan! 🚀</p>
                        <CustomButton
                          onClick={() => setShowForm(true)}
                          variant="primary"
                          size="lg"
                        >
                          <PlusIcon className="w-5 h-5 mr-2" />
                          Create Meal Plan
                        </CustomButton>
              </div>
            </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

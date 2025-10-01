import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, ClockIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';
import CustomButton from '../../components/CustomButton';
import RecipeImage from '../../components/RecipeImage';

export default function RecipeDetails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRecipe(data);
      } else {
        setError('Recipe not found');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError('Error loading recipe');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-300 border-t-amber-500 mx-auto"></div>
          <p className="mt-6 text-slate-800 text-lg">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Recipe Not Found</h1>
          <p className="text-slate-600 mb-8">{error || 'The recipe you are looking for does not exist.'}</p>
          <CustomButton
            onClick={() => router.push('/dashboard')}
            variant="primary"
            size="lg"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </CustomButton>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'Medium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'Hard':
        return 'bg-gradient-to-r from-red-500 to-red-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

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
                onClick={() => router.back()}
                variant="secondary"
                size="md"
                className="mr-4"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </CustomButton>
              <div className="bg-gradient-to-r from-[#f59e0b] to-[#f97316] p-3 rounded-2xl shadow-xl">
                <svg className="w-8 h-8 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="ml-4 text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Recipe Details
              </h1>
            </div>
            {session && (
              <div className="flex items-center space-x-4">
                <span className="text-slate-700 text-lg font-medium">Welcome, {session.user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 sm:px-6 lg:px-8 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          {/* Recipe Header */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-2xl overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-80 lg:h-96">
                <RecipeImage
                  src={recipe.photo}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="mb-6">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                    {recipe.name}
                  </h1>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    {recipe.description}
                  </p>
                </div>

                {/* Recipe Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <TagIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Category</p>
                      <p className="font-semibold text-slate-800">{recipe.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <UserIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Author</p>
                      <p className="font-semibold text-slate-800">{recipe.createdBy?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Time</p>
                      <p className="font-semibold text-slate-800">{recipe.prepTime + recipe.cookTime} min</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Difficulty</p>
                      <p className="font-semibold text-slate-800">{recipe.difficulty}</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm">
                    {recipe.category}
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm">
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingredients
              </h2>
              <div className="space-y-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <span className="font-semibold text-slate-800">{ingredient.amount}</span>
                      <span className="text-slate-600 ml-2">{ingredient.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Instructions
              </h2>
              <div className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {instruction.step}
                    </div>
                    <div className="flex-1 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                      <p className="text-slate-700 leading-relaxed">{instruction.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time Breakdown */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
              <ClockIcon className="w-8 h-8 text-purple-600 mr-3" />
              Time Breakdown
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-200/50">
                <div className="text-3xl font-bold text-blue-600 mb-2">{recipe.prepTime}</div>
                <div className="text-slate-600 font-medium">Prep Time (min)</div>
              </div>
              <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-200/50">
                <div className="text-3xl font-bold text-green-600 mb-2">{recipe.cookTime}</div>
                <div className="text-slate-600 font-medium">Cook Time (min)</div>
              </div>
              <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-slate-200/50">
                <div className="text-3xl font-bold text-purple-600 mb-2">{recipe.prepTime + recipe.cookTime}</div>
                <div className="text-slate-600 font-medium">Total Time (min)</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

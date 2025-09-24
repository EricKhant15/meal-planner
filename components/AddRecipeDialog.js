import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CustomSelect from './CustomSelect';

export default function AddRecipeDialog({ isOpen, onClose, onSubmit, recipes, newRecipeData, setNewRecipeData }) {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-left align-middle shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-white">
                    Add Recipe to Meal Plan
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  console.log('Form submitted with data:', newRecipeData);
                  
                  // Validate form data
                  if (!newRecipeData.recipe || !newRecipeData.mealType) {
                    alert('Please select both a recipe and meal type');
                    return;
                  }
                  
                  onSubmit(e);
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">Select Recipe</label>
                      <CustomSelect
                        value={newRecipeData.recipe}
                        onChange={(value) => {
                          console.log('Recipe selected:', value);
                          setNewRecipeData({ ...newRecipeData, recipe: value });
                        }}
                        placeholder="Choose a recipe..."
                        options={[
                          { value: '', label: 'Choose a recipe...' },
                          ...recipes.map((recipe) => ({
                            value: recipe._id,
                            label: `${recipe.name} - ${recipe.category}`
                          }))
                        ]}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">Meal Type</label>
                      <CustomSelect
                        value={newRecipeData.mealType}
                        onChange={(value) => {
                          console.log('Meal type selected:', value);
                          setNewRecipeData({ ...newRecipeData, mealType: value });
                        }}
                        placeholder="Select meal type..."
                        options={mealTypes.map((type) => ({
                          value: type,
                          label: type
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-8 py-4 bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-300/50 backdrop-blur-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newRecipeData.recipe || !newRecipeData.mealType}
                      className="px-10 py-4 bg-[#f59e0b] hover:bg-[#d97706] text-white rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300/50 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
                    >
                      Add Recipe
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

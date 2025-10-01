import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CustomInput from './CustomInput';
import CustomTextarea from './CustomTextarea';
import CustomSelect from './CustomSelect';
import CustomButton from './CustomButton';

export default function RecipeFormDialog({ isOpen, onClose, onSubmit, recipe = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: 'Easy',
    prepTime: '',
    cookTime: '',
    photo: '',
    ingredients: [{ name: '', amount: '' }],
    instructions: [{ step: 1, description: '' }]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name || '',
        description: recipe.description || '',
        category: recipe.category || '',
        difficulty: recipe.difficulty || 'Easy',
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        photo: recipe.photo || '',
        ingredients: recipe.ingredients && recipe.ingredients.length > 0 
          ? recipe.ingredients 
          : [{ name: '', amount: '' }],
        instructions: recipe.instructions && recipe.instructions.length > 0 
          ? recipe.instructions 
          : [{ step: 1, description: '' }]
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        difficulty: 'Easy',
        prepTime: '',
        cookTime: '',
        photo: '',
        ingredients: [{ name: '', amount: '' }],
        instructions: [{ step: 1, description: '' }]
      });
    }
  }, [recipe, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '' }]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleInstructionChange = (index, field, value) => {
    const newInstructions = [...formData.instructions];
    if (field === 'description') {
      newInstructions[index].description = value;
    }
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addInstruction = () => {
    const newStep = formData.instructions.length + 1;
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, { step: newStep, description: '' }]
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter((_, i) => i !== index);
      // Renumber steps
      const renumberedInstructions = newInstructions.map((instruction, i) => ({
        ...instruction,
        step: i + 1
      }));
      setFormData(prev => ({
        ...prev,
        instructions: renumberedInstructions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.category) {
        alert('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Validate ingredients
      const validIngredients = formData.ingredients.filter(ing => ing.name && ing.amount);
      if (validIngredients.length === 0) {
        alert('Please add at least one ingredient');
        setIsSubmitting(false);
        return;
      }

      // Validate instructions
      const validInstructions = formData.instructions.filter(inst => inst.description);
      if (validInstructions.length === 0) {
        alert('Please add at least one instruction');
        setIsSubmitting(false);
        return;
      }

      const recipeData = {
        ...formData,
        prepTime: parseInt(formData.prepTime) || 0,
        cookTime: parseInt(formData.cookTime) || 0,
        ingredients: validIngredients,
        instructions: validInstructions
      };

      await onSubmit(recipeData);
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Error saving recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/50 shadow-2xl text-left align-middle transition-all">
                <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              {recipe ? 'Edit Recipe' : 'Create New Recipe'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                label="Recipe Name *"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Spaghetti Carbonara"
                required
              />
              <CustomInput
                label="Category *"
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Italian, Dessert, Main Course"
                required
              />
            </div>

            <CustomTextarea
              label="Description *"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              placeholder="Describe your recipe..."
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <CustomSelect
                label="Difficulty *"
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                options={[
                  { value: 'Easy', label: 'Easy' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Hard', label: 'Hard' }
                ]}
                required
              />
              <CustomInput
                label="Prep Time (min)"
                type="number"
                value={formData.prepTime}
                onChange={(e) => handleInputChange('prepTime', e.target.value)}
                placeholder="15"
                min="0"
              />
              <CustomInput
                label="Cook Time (min)"
                type="number"
                value={formData.cookTime}
                onChange={(e) => handleInputChange('cookTime', e.target.value)}
                placeholder="30"
                min="0"
              />
            </div>

            <CustomInput
              label="Photo URL (Optional)"
              type="url"
              value={formData.photo}
              onChange={(e) => handleInputChange('photo', e.target.value)}
              placeholder="https://example.com/recipe-photo.jpg"
            />

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Ingredients</h3>
                <CustomButton
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={addIngredient}
                >
                  Add Ingredient
                </CustomButton>
              </div>
              <div className="space-y-4">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <CustomInput
                        label={`Ingredient ${index + 1}`}
                        type="text"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="e.g., Olive Oil"
                      />
                    </div>
                    <div className="flex-1">
                      <CustomInput
                        label="Amount"
                        type="text"
                        value={ingredient.amount}
                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                        placeholder="e.g., 2 tbsp"
                      />
                    </div>
                    {formData.ingredients.length > 1 && (
                      <CustomButton
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                      >
                        Remove
                      </CustomButton>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">Instructions</h3>
                <CustomButton
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={addInstruction}
                >
                  Add Step
                </CustomButton>
              </div>
              <div className="space-y-4">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {instruction.step}
                    </div>
                    <div className="flex-1">
                      <CustomTextarea
                        label={`Step ${instruction.step}`}
                        value={instruction.description}
                        onChange={(e) => handleInstructionChange(index, 'description', e.target.value)}
                        rows={3}
                        placeholder="Describe this step..."
                      />
                    </div>
                    {formData.instructions.length > 1 && (
                      <CustomButton
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                      >
                        Remove
                      </CustomButton>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
              <CustomButton
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (recipe ? 'Update Recipe' : 'Create Recipe')}
              </CustomButton>
            </div>
          </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

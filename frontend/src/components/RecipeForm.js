import React, { useState } from "react";
import "../styles/RecipeForm.css";

const RecipeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [{ name: "", amount: "", unit: "" }],
    instructions: [{ step: 1, description: "" }],
    prepTime: "",
    cookTime: "",
    servings: "",
    category: "main-course",
    difficulty: "medium",
    author: "",
    tags: "",
    validationPhrase: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", unit: "" }],
    }));
  };

  const removeIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index].description = value;
    setFormData((prev) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        {
          step: prev.instructions.length + 1,
          description: "",
        },
      ],
    }));
  };

  const removeInstruction = (index) => {
    const newInstructions = formData.instructions
      .filter((_, i) => i !== index)
      .map((instruction, i) => ({ ...instruction, step: i + 1 }));

    setFormData((prev) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationError("");

    // Validate the required phrase
    if (formData.validationPhrase !== "Jake is awesome!") {
      setValidationError(
        "Please enter the correct validation phrase to save your recipe."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Process tags (convert string to array)
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const recipeData = {
        ...formData,
        prepTime: parseInt(formData.prepTime),
        cookTime: parseInt(formData.cookTime),
        servings: parseInt(formData.servings),
        tags: tagsArray,
        // Filter out empty ingredients and instructions
        ingredients: formData.ingredients.filter(
          (ing) => ing.name && ing.amount && ing.unit
        ),
        instructions: formData.instructions.filter((inst) =>
          inst.description.trim()
        ),
      };

      // Remove the validation phrase from the data sent to the backend
      delete recipeData.validationPhrase;

      await onSubmit(recipeData);
    } catch (error) {
      console.error("Error submitting recipe:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {/* Basic Information */}
      <div className="form-section">
        <h3>Basic Information</h3>

        <div className="form-group">
          <label htmlFor="title">Recipe Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Enter recipe title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Describe your recipe..."
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              placeholder="Recipe author"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="appetizer">Appetizer</option>
              <option value="main-course">Main Course</option>
              <option value="side-dish">Side Dish</option>
              <option value="salad">Salad</option>
              <option value="soup">Soup</option>
              <option value="bread">Bread</option>
              <option value="dessert">Dessert</option>
              <option value="beverage">Beverage</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="prepTime">Prep Time (minutes) *</label>
            <input
              type="number"
              id="prepTime"
              name="prepTime"
              value={formData.prepTime}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="15"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cookTime">Cook Time (minutes) *</label>
            <input
              type="number"
              id="cookTime"
              name="cookTime"
              value={formData.cookTime}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="30"
            />
          </div>

          <div className="form-group">
            <label htmlFor="servings">Servings *</label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="form-section">
        <h3>Ingredients</h3>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) =>
                  handleIngredientChange(index, "name", e.target.value)
                }
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) =>
                  handleIngredientChange(index, "amount", e.target.value)
                }
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Unit (cups, tsp, etc.)"
                value={ingredient.unit}
                onChange={(e) =>
                  handleIngredientChange(index, "unit", e.target.value)
                }
                required
              />
            </div>
            {formData.ingredients.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeIngredient(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addIngredient}>
          Add Ingredient
        </button>
      </div>

      {/* Instructions */}
      <div className="form-section">
        <h3>Instructions</h3>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="instruction-row">
            <span className="step-number">{instruction.step}.</span>
            <div className="form-group">
              <textarea
                placeholder="Describe this step..."
                value={instruction.description}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                required
                rows="2"
              />
            </div>
            {formData.instructions.length > 1 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeInstruction(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addInstruction}>
          Add Step
        </button>
      </div>

      {/* Optional Fields */}
      <div className="form-section">
        <h3>Optional Details</h3>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="quick, easy, family-friendly, vegetarian"
          />
        </div>
      </div>

      {/* Validation Section */}
      <div className="form-section">
        <h3>Passphrase</h3>

        <div className="form-group">
          <label htmlFor="validationPhrase">
            Enter the required passphrase *
          </label>
          <input
            type="text"
            id="validationPhrase"
            name="validationPhrase"
            value={formData.validationPhrase}
            onChange={handleInputChange}
            required
            placeholder="Enter passphrase..."
            className={validationError ? "error" : ""}
          />
          {validationError && (
            <div className="error-message">{validationError}</div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;

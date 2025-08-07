import React, { useState, useEffect } from "react";
import "../styles/RecipeDetailModal.css";

const RecipeDetailModal = ({ recipe, isOpen, onClose, onSave }) => {
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecipe, setEditedRecipe] = useState(null);
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [passphraseError, setPassphraseError] = useState("");
  const [showPassphrasePassword, setShowPassphrasePassword] = useState(false);
  const [tagsInputValue, setTagsInputValue] = useState("");

  const togglePassphrasePasswordVisibility = () => {
    setShowPassphrasePassword(!showPassphrasePassword);
  };

  useEffect(() => {
    if (recipe) {
      setEditedRecipe({ ...recipe });
      setTagsInputValue(recipe.tags ? recipe.tags.join(", ") : "");
    }
  }, [recipe]);

  // Handle body scroll prevention
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  // Check if changes have been made
  const hasChanges = () => {
    if (!recipe || !editedRecipe) return false;

    // Deep comparison of recipe objects
    const compareArrays = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every(
        (item, index) => JSON.stringify(item) === JSON.stringify(arr2[index])
      );
    };

    return (
      recipe.title !== editedRecipe.title ||
      recipe.description !== editedRecipe.description ||
      recipe.author !== editedRecipe.author ||
      recipe.category !== editedRecipe.category ||
      recipe.prepTime !== editedRecipe.prepTime ||
      recipe.cookTime !== editedRecipe.cookTime ||
      recipe.servings !== editedRecipe.servings ||
      recipe.difficulty !== editedRecipe.difficulty ||
      !compareArrays(recipe.ingredients, editedRecipe.ingredients) ||
      !compareArrays(recipe.instructions, editedRecipe.instructions) ||
      !compareArrays(recipe.tags || [], editedRecipe.tags || [])
    );
  };

  if (!isOpen || !recipe || !editedRecipe) return null;

  const handleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEdit = () => {
    setShowPassphraseModal(true);
    setPassphrase("");
    setPassphraseError("");
  };

  const handlePassphraseSubmit = () => {
    if (passphrase !== "Jake is awesome!") {
      setPassphraseError(
        "Please enter the correct passphrase to edit this recipe."
      );
      return;
    }

    setShowPassphraseModal(false);
    setPassphrase("");
    setPassphraseError("");
    setIsEditing(true);
  };

  const handlePassphraseCancel = () => {
    setShowPassphraseModal(false);
    setPassphrase("");
    setPassphraseError("");
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(editedRecipe);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRecipe({ ...recipe });
    setTagsInputValue(recipe.tags ? recipe.tags.join(", ") : "");
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedRecipe((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setEditedRecipe((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...editedRecipe.instructions];
    newInstructions[index] = { ...newInstructions[index], description: value };
    setEditedRecipe((prev) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  const addIngredient = () => {
    setEditedRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: "", unit: "" }],
    }));
  };

  const removeIngredient = (index) => {
    setEditedRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addInstruction = () => {
    setEditedRecipe((prev) => ({
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
    const newInstructions = editedRecipe.instructions
      .filter((_, i) => i !== index)
      .map((instruction, i) => ({ ...instruction, step: i + 1 }));

    setEditedRecipe((prev) => ({
      ...prev,
      instructions: newInstructions,
    }));
  };

  const totalTime = editedRecipe.prepTime + editedRecipe.cookTime;

  return (
    <div className="recipe-detail-backdrop">
      <div className="recipe-detail-modal">
        <div className="recipe-detail-header">
          <div className="recipe-detail-title-section">
            {isEditing ? (
              <input
                type="text"
                value={editedRecipe.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="edit-title-input"
              />
            ) : (
              <h1>{editedRecipe.title}</h1>
            )}
            {isEditing ? (
              <select
                value={editedRecipe.difficulty}
                onChange={(e) =>
                  handleFieldChange("difficulty", e.target.value)
                }
                className="edit-difficulty-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            ) : (
              <span
                className={`difficulty-badge difficulty-${editedRecipe.difficulty}`}
              >
                {editedRecipe.difficulty}
              </span>
            )}
          </div>
          <div className="recipe-detail-actions">
            {isEditing ? (
              <>
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={!hasChanges()}
                >
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={handleEdit}>
                Edit
              </button>
            )}
            <button className="recipe-detail-close" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="recipe-detail-body">
          <div className="recipe-meta-section">
            <div className="recipe-description">
              {isEditing ? (
                <textarea
                  value={editedRecipe.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  className="edit-description-textarea"
                  rows="3"
                />
              ) : (
                <p>{editedRecipe.description}</p>
              )}
            </div>

            <div className="recipe-info-grid">
              <div className="info-item">
                <span className="info-label">Author:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedRecipe.author}
                    onChange={(e) =>
                      handleFieldChange("author", e.target.value)
                    }
                    className="edit-info-input"
                  />
                ) : (
                  <span className="info-value">{editedRecipe.author}</span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Category:</span>
                {isEditing ? (
                  <select
                    value={editedRecipe.category}
                    onChange={(e) =>
                      handleFieldChange("category", e.target.value)
                    }
                    className="edit-info-select"
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
                ) : (
                  <span className="info-value">{editedRecipe.category}</span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Prep Time:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedRecipe.prepTime}
                    onChange={(e) =>
                      handleFieldChange("prepTime", parseInt(e.target.value))
                    }
                    className="edit-info-input"
                    min="1"
                  />
                ) : (
                  <span className="info-value">
                    {editedRecipe.prepTime} minutes
                  </span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Cook Time:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedRecipe.cookTime}
                    onChange={(e) =>
                      handleFieldChange("cookTime", parseInt(e.target.value))
                    }
                    className="edit-info-input"
                    min="1"
                  />
                ) : (
                  <span className="info-value">
                    {editedRecipe.cookTime} minutes
                  </span>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Total Time:</span>
                <span className="info-value">{totalTime} minutes</span>
              </div>
              <div className="info-item">
                <span className="info-label">Servings:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedRecipe.servings}
                    onChange={(e) =>
                      handleFieldChange("servings", parseInt(e.target.value))
                    }
                    className="edit-info-input"
                    min="1"
                  />
                ) : (
                  <span className="info-value">{editedRecipe.servings}</span>
                )}
              </div>
              <div className="info-item tags-item">
                <span className="info-label">Tags:</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={tagsInputValue}
                    onChange={(e) => {
                      setTagsInputValue(e.target.value);
                    }}
                    onBlur={(e) => {
                      // Parse and clean tags when field loses focus
                      const tagsString = e.target.value;
                      const cleanedTags = tagsString
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag.length > 0);
                      handleFieldChange("tags", cleanedTags);
                      // Update input value to show cleaned version
                      setTagsInputValue(cleanedTags.join(", "));
                    }}
                    className="edit-info-input"
                    placeholder="Enter tags separated by commas"
                  />
                ) : (
                  <div className="tags-display">
                    {editedRecipe.tags && editedRecipe.tags.length > 0 ? (
                      editedRecipe.tags.map((tag, index) => (
                        <span key={index} className="tag-pill">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="info-value no-tags">No tags</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="recipe-content-grid">
            <div className="ingredients-section">
              <div className="section-header">
                <h2>Ingredients</h2>
                {isEditing && (
                  <button className="add-item-btn" onClick={addIngredient}>
                    + Add Ingredient
                  </button>
                )}
              </div>
              <div className="ingredients-list">
                {editedRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    {isEditing ? (
                      <div className="edit-ingredient-row">
                        <input
                          type="text"
                          value={ingredient.name}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Ingredient name"
                          className="edit-ingredient-input"
                        />
                        <input
                          type="text"
                          value={ingredient.amount}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="Amount"
                          className="edit-ingredient-input small"
                        />
                        <input
                          type="text"
                          value={ingredient.unit}
                          onChange={(e) =>
                            handleIngredientChange(
                              index,
                              "unit",
                              e.target.value
                            )
                          }
                          placeholder="Unit"
                          className="edit-ingredient-input small"
                        />
                        <button
                          className="remove-item-btn"
                          onClick={() => removeIngredient(index)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="ingredient-checkbox">
                        <input
                          type="checkbox"
                          checked={checkedIngredients[index] || false}
                          onChange={() => handleIngredientCheck(index)}
                        />
                        <span className="checkmark"></span>
                        <span
                          className={`ingredient-text ${
                            checkedIngredients[index] ? "checked" : ""
                          }`}
                        >
                          {ingredient.amount} {ingredient.unit}{" "}
                          {ingredient.name}
                        </span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="instructions-section">
              <div className="section-header">
                <h2>Instructions</h2>
                {isEditing && (
                  <button className="add-item-btn" onClick={addInstruction}>
                    + Add Step
                  </button>
                )}
              </div>
              <div className="instructions-list">
                {editedRecipe.instructions.map((instruction, index) => (
                  <div key={index} className="instruction-item">
                    <div className="instruction-step">{instruction.step}</div>
                    {isEditing ? (
                      <div className="edit-instruction-row">
                        <textarea
                          value={instruction.description}
                          onChange={(e) =>
                            handleInstructionChange(index, e.target.value)
                          }
                          className="edit-instruction-textarea"
                          rows="2"
                        />
                        <button
                          className="remove-item-btn"
                          onClick={() => removeInstruction(index)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="instruction-text">
                        {instruction.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Passphrase Validation Modal */}
      {showPassphraseModal && (
        <div className="passphrase-modal-overlay">
          <div className="passphrase-modal">
            <div className="passphrase-modal-header">
              <h3>Enter Passphrase</h3>
              <button
                className="passphrase-modal-close"
                onClick={handlePassphraseCancel}
              >
                ×
              </button>
            </div>
            <div className="passphrase-modal-body">
              <p>Please enter the required passphrase to edit this recipe:</p>
              <div className="password-input-container">
                <input
                  type={showPassphrasePassword ? "text" : "password"}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handlePassphraseSubmit()
                  }
                  placeholder="Enter passphrase..."
                  className={
                    passphraseError
                      ? "passphrase-input error"
                      : "passphrase-input"
                  }
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePassphrasePasswordVisibility}
                  aria-label={
                    showPassphrasePassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassphrasePassword ? "🙈" : "👁️"}
                </button>
              </div>
              {passphraseError && (
                <div className="passphrase-error">{passphraseError}</div>
              )}
            </div>
            <div className="passphrase-modal-actions">
              <button
                className="passphrase-cancel-btn"
                onClick={handlePassphraseCancel}
              >
                Cancel
              </button>
              <button
                className="passphrase-submit-btn"
                onClick={handlePassphraseSubmit}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailModal;

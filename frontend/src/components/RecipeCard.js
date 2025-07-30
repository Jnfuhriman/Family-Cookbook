import React from "react";
import "../styles/RecipeCard.css";

const RecipeCard = ({ recipe, onClick }) => {
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleCardClick = () => {
    if (onClick) {
      onClick(recipe);
    }
  };

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <div className="recipe-card-header">
        <h3 className="recipe-title">{recipe.title}</h3>
        <span className={`difficulty-badge difficulty-${recipe.difficulty}`}>
          {recipe.difficulty}
        </span>
      </div>

      <div className="recipe-card-body">
        <div className="recipe-meta">
          <div className="time-info">
            <div className="time-item">
              <span className="time-label">Prep:</span>
              <span className="time-value">{recipe.prepTime}m</span>
            </div>
            <div className="time-item">
              <span className="time-label">Cook:</span>
              <span className="time-value">{recipe.cookTime}m</span>
            </div>
            <div className="time-item total-time">
              <span className="time-label">Total:</span>
              <span className="time-value">{totalTime}m</span>
            </div>
          </div>

          <div className="servings-info">
            <span className="servings-label">Serves:</span>
            <span className="servings-value">{recipe.servings}</span>
          </div>
        </div>

        <div className="recipe-description">{recipe.description}</div>
      </div>

      <div className="recipe-card-footer">
        <div className="tags-container">
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="tags-list">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

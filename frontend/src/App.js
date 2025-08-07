import "./styles/App.css";
import CreateRecipeButton from "./components/CreateRecipeButton";
import RecipeCard from "./components/RecipeCard";
import RecipeDetailModal from "./components/RecipeDetailModal";
import React, { useState, useEffect } from "react";

// API Base URL - uses environment variable or defaults to localhost
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/recipes`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch recipes");
      }

      setRecipes(result.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeCreated = (newRecipe) => {
    console.log("New recipe created:", newRecipe);
    // Add the new recipe to the list
    setRecipes((prevRecipes) => [newRecipe, ...prevRecipes]);
  };

  const handleRecipeUpdated = async (updatedRecipe) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/recipes/${updatedRecipe._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecipe),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update recipe");
      }

      // Update the recipe in the local state
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === updatedRecipe._id ? result.data : recipe
        )
      );

      // Update the selected recipe if it's the same one
      if (selectedRecipe && selectedRecipe._id === updatedRecipe._id) {
        setSelectedRecipe(result.data);
      }

      console.log("Recipe updated successfully:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter((recipe) => {
    if (!searchTerm.trim()) return true;

    return recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Group filtered recipes by category
  const groupedRecipes = filteredRecipes.reduce((groups, recipe) => {
    const category = recipe.category || "other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(recipe);
    return groups;
  }, {});

  // Define category order and display names
  const categoryOrder = [
    { key: "appetizer", name: "Appetizers" },
    { key: "main-course", name: "Main Courses" },
    { key: "side-dish", name: "Side Dishes" },
    { key: "salad", name: "Salads" },
    { key: "soup", name: "Soups" },
    { key: "bread", name: "Breads" },
    { key: "dessert", name: "Desserts" },
    { key: "beverage", name: "Beverages" },
    { key: "other", name: "Other" },
  ];

  // Sort categories and recipes within categories
  const sortedCategories = categoryOrder.filter(
    (cat) => groupedRecipes[cat.key] && groupedRecipes[cat.key].length > 0
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Family Cookbook</h1>
        <p>Create and manage the family's favorite recipes</p>

        <div className="app-actions">
          <CreateRecipeButton onRecipeCreated={handleRecipeCreated} />
        </div>
      </header>

      <main className="app-main">
        <div className="recipes-container">
          {loading && (
            <div className="loading-message">
              <p>Loading recipes...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error loading recipes: {error}</p>
              <button onClick={fetchRecipes} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && recipes.length === 0 && (
            <div className="empty-state">
              <h2>No Recipes Yet</h2>
              <p>Start building your cookbook by adding your first recipe!</p>
            </div>
          )}

          {!loading && !error && recipes.length > 0 && (
            <>
              <div className="recipes-header">
                <h2>Recipes ({filteredRecipes.length})</h2>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search recipes by name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                  />
                </div>
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="no-results">
                  <p>No recipes found matching "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="clear-search-btn"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="recipes-by-category">
                  {sortedCategories.map((category) => (
                    <div key={category.key} className="category-section">
                      <div className="category-header">
                        <h3>{category.name}</h3>
                        <span className="category-count">
                          ({groupedRecipes[category.key].length})
                        </span>
                      </div>
                      <div className="recipes-grid">
                        {groupedRecipes[category.key].map((recipe) => (
                          <RecipeCard
                            key={recipe._id}
                            recipe={recipe}
                            onClick={handleRecipeClick}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleRecipeUpdated}
      />
    </div>
  );
}

export default App;

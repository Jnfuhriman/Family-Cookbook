import React, { useState } from "react";
import Modal from "./Modal";
import RecipeForm from "./RecipeForm";
import "../styles/CreateRecipeButton.css";

// API Base URL - uses environment variable or defaults to localhost
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const CreateRecipeButton = ({ onRecipeCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setError(null);
    setSuccess(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(null);
    setSuccess(false);
  };

  const handleRecipeSubmit = async (recipeData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create recipe");
      }

      setSuccess(true);

      // Call the callback function if provided
      if (onRecipeCreated) {
        onRecipeCreated(result.data);
      }

      // Close modal after a brief success message
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error("Error creating recipe:", error);
      setError(error.message || "Failed to create recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="create-recipe-btn" onClick={openModal}>
        <span className="btn-icon">+</span>
        Add New Recipe
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Recipe"
      >
        {success ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Recipe Created Successfully!</h3>
            <p>Your recipe has been added to the cookbook.</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="error-message">
                <strong>Error:</strong> {error}
              </div>
            )}

            <RecipeForm onSubmit={handleRecipeSubmit} onCancel={closeModal} />
          </>
        )}
      </Modal>
    </>
  );
};

export default CreateRecipeButton;

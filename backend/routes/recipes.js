const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// GET /api/recipes - Get all recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recipes",
      error: error.message,
    });
  }
});

// GET /api/recipes/:id - Get single recipe by ID
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recipe",
      error: error.message,
    });
  }
});

// POST /api/recipes - Create new recipe
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
      tags,
      difficulty,
      author,
      imageUrl,
    } = req.body;

    // Basic validation
    if (
      !title ||
      !description ||
      !ingredients ||
      !instructions ||
      !prepTime ||
      !cookTime ||
      !servings ||
      !category ||
      !author
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: title, description, ingredients, instructions, prepTime, cookTime, servings, category, and author",
      });
    }

    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
      tags: tags || [],
      difficulty: difficulty || "medium",
      author,
      imageUrl,
    });

    const savedRecipe = await newRecipe.save();

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: savedRecipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating recipe",
      error: error.message,
    });
  }
});

// PUT /api/recipes/:id - Update recipe
router.put("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Recipe updated successfully",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating recipe",
      error: error.message,
    });
  }
});

// DELETE /api/recipes/:id - Delete recipe
router.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting recipe",
      error: error.message,
    });
  }
});

// GET /api/recipes/search/:query - Search recipes by title or description
router.get("/search/:query", async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { tags: { $regex: searchQuery, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching recipes",
      error: error.message,
    });
  }
});

// GET /api/recipes/category/:category - Get recipes by category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const recipes = await Recipe.find({ category }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    console.error("Error fetching recipes by category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recipes by category",
      error: error.message,
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// Admin authentication middleware (simple passphrase check)
const authenticateAdmin = (req, res, next) => {
  const passphrase = req.headers["x-admin-passphrase"] || req.body.passphrase;

  if (passphrase !== "Jake is awesome!") {
    return res.status(401).json({
      success: false,
      message: "Invalid admin passphrase",
    });
  }

  next();
};

// Bulk create recipes
router.post("/bulk-recipes", authenticateAdmin, async (req, res) => {
  try {
    const { recipes } = req.body;

    if (!Array.isArray(recipes)) {
      return res.status(400).json({
        success: false,
        message: "Recipes must be an array",
      });
    }

    // Validate each recipe has required fields
    const invalidRecipes = recipes.filter(
      (recipe) => !recipe.title || !recipe.ingredients || !recipe.instructions
    );

    if (invalidRecipes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${invalidRecipes.length} recipes are missing required fields (title, ingredients, instructions)`,
      });
    }

    // Process recipes with defaults
    const processedRecipes = recipes.map((recipe) => ({
      title: recipe.title,
      description: recipe.description || "",
      ingredients: recipe.ingredients,
      instructions: recipe.instructions.map((instruction, index) => ({
        step: index + 1,
        description: instruction.description || instruction,
      })),
      prepTime: parseInt(recipe.prepTime) || 30,
      cookTime: parseInt(recipe.cookTime) || 30,
      servings: parseInt(recipe.servings) || 4,
      category: recipe.category || "other",
      difficulty: recipe.difficulty || "medium",
      author: recipe.author || "Admin",
      tags: Array.isArray(recipe.tags) ? recipe.tags : [],
    }));

    // Insert all recipes
    const createdRecipes = await Recipe.insertMany(processedRecipes);

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdRecipes.length} recipes`,
      data: createdRecipes,
      count: createdRecipes.length,
    });
  } catch (error) {
    console.error("Bulk recipe creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create recipes in bulk",
      error: error.message,
    });
  }
});

// Delete all recipes (use with caution!)
router.delete("/all-recipes", authenticateAdmin, async (req, res) => {
  try {
    const result = await Recipe.deleteMany({});

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} recipes`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk recipe deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete recipes",
      error: error.message,
    });
  }
});

// Get admin statistics
router.get("/stats", authenticateAdmin, async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments();
    const recipesByCategory = await Recipe.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const recipesByDifficulty = await Recipe.aggregate([
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalRecipes,
        recipesByCategory,
        recipesByDifficulty,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get admin statistics",
      error: error.message,
    });
  }
});

// Seed sample recipes
router.post("/seed-sample-data", authenticateAdmin, async (req, res) => {
  try {
    const sampleRecipes = [
      {
        title: "Classic Chocolate Chip Cookies",
        description:
          "Soft and chewy chocolate chip cookies that are perfect for any occasion.",
        ingredients: [
          { name: "All-purpose flour", amount: "2¼", unit: "cups" },
          { name: "Baking soda", amount: "1", unit: "teaspoon" },
          { name: "Salt", amount: "1", unit: "teaspoon" },
          { name: "Butter", amount: "1", unit: "cup" },
          { name: "Brown sugar", amount: "¾", unit: "cup" },
          { name: "White sugar", amount: "¾", unit: "cup" },
          { name: "Large eggs", amount: "2", unit: "pieces" },
          { name: "Vanilla extract", amount: "2", unit: "teaspoons" },
          { name: "Chocolate chips", amount: "2", unit: "cups" },
        ],
        instructions: [
          { step: 1, description: "Preheat oven to 375°F (190°C)." },
          {
            step: 2,
            description: "Mix flour, baking soda, and salt in a bowl.",
          },
          { step: 3, description: "Cream butter and sugars until fluffy." },
          { step: 4, description: "Beat in eggs and vanilla." },
          { step: 5, description: "Gradually add flour mixture." },
          { step: 6, description: "Stir in chocolate chips." },
          {
            step: 7,
            description: "Drop rounded tablespoons onto baking sheet.",
          },
          { step: 8, description: "Bake 9-11 minutes until golden brown." },
        ],
        prepTime: 15,
        cookTime: 10,
        servings: 48,
        category: "dessert",
        difficulty: "easy",
        author: "Admin",
        tags: ["cookies", "chocolate", "baking", "dessert"],
      },
      {
        title: "Homemade Pizza Dough",
        description:
          "Perfect pizza dough recipe that's easy to make and delicious.",
        ingredients: [
          { name: "Warm water", amount: "1", unit: "cup" },
          { name: "Active dry yeast", amount: "1", unit: "packet" },
          { name: "Sugar", amount: "1", unit: "teaspoon" },
          { name: "All-purpose flour", amount: "3", unit: "cups" },
          { name: "Olive oil", amount: "2", unit: "tablespoons" },
          { name: "Salt", amount: "1", unit: "teaspoon" },
        ],
        instructions: [
          {
            step: 1,
            description:
              "Dissolve yeast and sugar in warm water. Let sit 5 minutes.",
          },
          { step: 2, description: "Mix flour and salt in a large bowl." },
          { step: 3, description: "Add yeast mixture and olive oil to flour." },
          {
            step: 4,
            description: "Knead dough for 8-10 minutes until smooth.",
          },
          {
            step: 5,
            description: "Place in oiled bowl, cover, and let rise 1 hour.",
          },
          { step: 6, description: "Punch down and roll out for pizza." },
        ],
        prepTime: 20,
        cookTime: 0,
        servings: 2,
        category: "bread",
        difficulty: "medium",
        author: "Admin",
        tags: ["pizza", "dough", "bread", "italian"],
      },
      {
        title: "Garden Fresh Salad",
        description: "A light and refreshing salad with seasonal vegetables.",
        ingredients: [
          { name: "Mixed greens", amount: "4", unit: "cups" },
          { name: "Cherry tomatoes", amount: "1", unit: "cup" },
          { name: "Cucumber", amount: "1", unit: "medium" },
          { name: "Red onion", amount: "¼", unit: "cup" },
          { name: "Olive oil", amount: "3", unit: "tablespoons" },
          { name: "Balsamic vinegar", amount: "2", unit: "tablespoons" },
          { name: "Salt", amount: "½", unit: "teaspoon" },
          { name: "Black pepper", amount: "¼", unit: "teaspoon" },
        ],
        instructions: [
          { step: 1, description: "Wash and dry all vegetables thoroughly." },
          { step: 2, description: "Chop cucumber and slice red onion thinly." },
          { step: 3, description: "Halve cherry tomatoes." },
          { step: 4, description: "Combine all vegetables in a large bowl." },
          {
            step: 5,
            description: "Whisk olive oil, vinegar, salt, and pepper together.",
          },
          {
            step: 6,
            description: "Drizzle dressing over salad and toss gently.",
          },
        ],
        prepTime: 10,
        cookTime: 0,
        servings: 4,
        category: "salad",
        difficulty: "easy",
        author: "Admin",
        tags: ["healthy", "fresh", "vegetarian", "quick"],
      },
    ];

    const createdRecipes = await Recipe.insertMany(sampleRecipes);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${createdRecipes.length} sample recipes`,
      data: createdRecipes,
      count: createdRecipes.length,
    });
  } catch (error) {
    console.error("Sample data seeding error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed sample data",
      error: error.message,
    });
  }
});

module.exports = router;

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true,
      },
      amount: {
        type: String,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
  ],
  instructions: [
    {
      step: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  prepTime: {
    type: Number, // in minutes
    required: true,
  },
  cookTime: {
    type: Number, // in minutes
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "appetizer",
      "main-course",
      "side-dish",
      "salad",
      "soup",
      "bread",
      "dessert",
      "beverage",
    ],
    required: true,
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  author: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
recipeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Recipe", recipeSchema);

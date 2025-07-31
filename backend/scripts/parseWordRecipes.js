const fs = require("fs");
const path = require("path");

class RecipeParser {
  constructor() {
    this.validCategories = [
      "appetizer",
      "main-course",
      "side-dish",
      "salad",
      "soup",
      "bread",
      "dessert",
      "beverage",
    ];
    this.validDifficulties = ["easy", "medium", "hard"];
  }

  async parseRecipesFromFolder(folderPath) {
    try {
      console.log(`🔍 Scanning folder: ${folderPath}`);

      const files = fs
        .readdirSync(folderPath)
        .filter(
          (file) =>
            file.toLowerCase().endsWith(".docx") ||
            file.toLowerCase().endsWith(".doc")
        );

      console.log(`📄 Found ${files.length} Word documents`);

      const recipes = [];
      const errors = [];

      for (const file of files) {
        try {
          console.log(`\n📖 Processing: ${file}`);
          const filePath = path.join(folderPath, file);
          const recipe = await this.parseRecipeDocument(filePath, file);

          if (recipe) {
            recipes.push(recipe);
            console.log(`✅ Successfully parsed: ${recipe.title}`);
          } else {
            console.log(`⚠️  Could not extract recipe from: ${file}`);
            errors.push({ file, error: "Could not parse recipe structure" });
          }
        } catch (error) {
          console.error(`❌ Error processing ${file}:`, error.message);
          errors.push({ file, error: error.message });
        }
      }

      return { recipes, errors };
    } catch (error) {
      console.error("❌ Error reading folder:", error);
      return {
        recipes: [],
        errors: [{ folder: folderPath, error: error.message }],
      };
    }
  }

  async parseRecipeDocument(filePath, fileName) {
    try {
      // Install mammoth if not present
      let mammoth;
      try {
        mammoth = require("mammoth");
      } catch (error) {
        console.log("📦 Installing mammoth dependency...");
        const { execSync } = require("child_process");
        execSync("npm install mammoth", {
          stdio: "inherit",
          cwd: path.join(__dirname, ".."),
        });
        mammoth = require("mammoth");
      }

      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value;

      if (!text || text.trim().length < 50) {
        console.log(`⚠️  Document too short or empty: ${fileName}`);
        return null;
      }

      console.log(`📝 Extracted ${text.length} characters from ${fileName}`);

      // Create base recipe object
      const recipe = {
        title: this.extractTitle(text, fileName),
        description: this.extractDescription(text),
        ingredients: this.extractIngredients(text),
        instructions: this.extractInstructions(text),
        prepTime: this.extractPrepTime(text),
        cookTime: this.extractCookTime(text),
        servings: this.extractServings(text),
        category: this.extractCategory(text),
        tags: this.extractTags(text),
        difficulty: this.extractDifficulty(text),
        author: this.extractAuthor(text, fileName),
      };

      // Validate required fields
      if (!this.validateRecipe(recipe)) {
        console.log(`⚠️  Recipe validation failed for: ${fileName}`);
        console.log(
          "Missing/invalid fields:",
          this.getValidationIssues(recipe)
        );

        // Try to fix common issues
        recipe.description =
          recipe.description ||
          `A delicious ${recipe.title.toLowerCase()} recipe.`;
        if (recipe.ingredients.length === 0) {
          recipe.ingredients.push({
            name: "See original recipe",
            amount: "1",
            unit: "recipe",
          });
        }
        if (recipe.instructions.length === 0) {
          recipe.instructions.push({
            step: 1,
            description: "Follow original recipe instructions.",
          });
        }

        // Validate again after fixes
        if (!this.validateRecipe(recipe)) {
          return null;
        }
      }

      return recipe;
    } catch (error) {
      console.error(`Error parsing document ${fileName}:`, error);
      return null;
    }
  }

  extractTitle(text, fileName) {
    // Try multiple patterns for title extraction
    const patterns = [
      /(?:recipe\s*name|title|recipe):\s*(.+)/i,
      /^([^:\n]+)(?:\s*recipe|\s*ingredients|\s*serves)/i,
      /(.+?)(?:\n\n|\n\s*\n)/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1].trim().length > 2) {
        let title = match[1].trim();
        // Clean up common artifacts
        title = title.replace(/recipe$/i, "").trim();
        title = title.replace(/^recipe:?\s*/i, "").trim();
        if (title.length > 3 && title.length < 100) {
          return title;
        }
      }
    }

    // Fallback to filename
    return (
      fileName
        .replace(/\.docx?$/i, "")
        .replace(/[_-]/g, " ")
        .trim() || "Untitled Recipe"
    );
  }

  extractDescription(text) {
    const patterns = [
      /(?:description|about|summary):\s*(.+?)(?:\n\n|ingredients?:|directions?:|instructions?:|prep time|cook time)/is,
      /^[^:\n]+\n\s*(.+?)(?:\n\n|ingredients?:|directions?:|instructions?:|prep time|cook time)/is,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1].trim().length > 10) {
        return match[1].trim().substring(0, 500); // Limit length
      }
    }

    // Generate a basic description
    const title = this.extractTitle(text, "recipe");
    return `A delicious ${title.toLowerCase()} recipe.`;
  }

  extractIngredients(text) {
    const patterns = [
      /ingredients?:\s*((?:[\s\S]*?)?)(?:\n\s*(?:directions?|instructions?|method|steps?):|$)/i,
      /ingredients?:([\s\S]*?)(?:directions?|instructions?|method|steps?|preparation)/i,
    ];

    let ingredientsText = "";
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        ingredientsText = match[1];
        break;
      }
    }

    if (!ingredientsText) {
      // Try to find bullet points or dashed lists anywhere in text
      const lines = text.split("\n");
      let inIngredients = false;
      const ingredientLines = [];

      for (const line of lines) {
        if (/ingredients?/i.test(line)) {
          inIngredients = true;
          continue;
        }
        if (
          inIngredients &&
          /(?:directions?|instructions?|method|steps?)/i.test(line)
        ) {
          break;
        }
        if (
          inIngredients &&
          (line.trim().startsWith("-") ||
            line.trim().startsWith("•") ||
            /^\d/.test(line.trim()))
        ) {
          ingredientLines.push(line);
        }
      }
      ingredientsText = ingredientLines.join("\n");
    }

    // Parse individual ingredients
    const ingredients = [];
    const lines = ingredientsText.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length < 3) continue;

      // Remove bullets, numbers, etc.
      const cleaned = trimmed.replace(/^[-•*\d.)\s]+/, "").trim();
      if (cleaned.length < 3) continue;

      const ingredient = this.parseIngredientLine(cleaned);
      if (ingredient) {
        ingredients.push(ingredient);
      }
    }

    return ingredients;
  }

  parseIngredientLine(line) {
    // Multiple patterns to handle different formats
    const patterns = [
      // "2 cups flour" or "1 tsp salt"
      /^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(\w+)\s+(.+)$/,
      // "2.5 cups of flour"
      /^(\d+(?:\.\d+)?(?:\/\d+)?)\s+(\w+)\s+(?:of\s+)?(.+)$/,
      // "1/2 cup flour"
      /^(\d+\/\d+)\s+(\w+)\s+(.+)$/,
      // "flour - 2 cups"
      /^(.+?)\s*[-–]\s*(\d+(?:\.\d+)?(?:\/\d+)?)\s+(\w+)$/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match && match.length >= 4) {
        if (pattern.source.includes("[-–]")) {
          return {
            name: match[1].trim(),
            amount: match[2].trim(),
            unit: match[3].trim(),
          };
        } else {
          return {
            name: match[3].trim(),
            amount: match[1].trim(),
            unit: match[2].trim(),
          };
        }
      }
    }

    // Fallback - just ingredient name
    return {
      name: line.trim(),
      amount: "1",
      unit: "item",
    };
  }

  extractInstructions(text) {
    const patterns = [
      /(?:directions?|instructions?|method|steps?|preparation):\s*([\s\S]*?)(?:\n\s*(?:notes?|tips?|nutrition|serves?|yield)|$)/i,
      /(?:directions?|instructions?|method|steps?):([\s\S]*)/i,
    ];

    let instructionsText = "";
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        instructionsText = match[1];
        break;
      }
    }

    // Parse individual steps
    const instructions = [];
    const lines = instructionsText.split("\n");
    let stepNumber = 1;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length < 5) continue;

      // Remove step numbers if present
      const cleaned = trimmed.replace(/^\d+[\.)]\s*/, "").trim();
      if (cleaned.length > 5) {
        instructions.push({
          step: stepNumber++,
          description: cleaned,
        });
      }
    }

    return instructions;
  }

  extractPrepTime(text) {
    const patterns = [
      /prep(?:\s*time)?:\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/i,
      /preparation(?:\s*time)?:\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/i,
      /(\d+)\s*(?:minutes?|mins?)\s*prep/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[0].toLowerCase();
        return unit.includes("hour") || unit.includes("hr")
          ? value * 60
          : value;
      }
    }

    return 15; // Default prep time
  }

  extractCookTime(text) {
    const patterns = [
      /cook(?:\s*time)?:\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/i,
      /bake(?:\s*time)?:\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/i,
      /(\d+)\s*(?:minutes?|mins?)\s*(?:cook|bake)/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[0].toLowerCase();
        return unit.includes("hour") || unit.includes("hr")
          ? value * 60
          : value;
      }
    }

    return 30; // Default cook time
  }

  extractServings(text) {
    const patterns = [
      /serves?\s*:?\s*(\d+)/i,
      /(?:makes?|yields?)\s*:?\s*(\d+)/i,
      /(\d+)\s*servings?/i,
      /(\d+)\s*portions?/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const servings = parseInt(match[1]);
        if (servings > 0 && servings < 100) {
          return servings;
        }
      }
    }

    return 4; // Default servings
  }

  extractCategory(text) {
    const categoryMap = {
      appetizer: ["appetizer", "starter", "snack", "hors d'oeuvre"],
      "main-course": [
        "main",
        "entree",
        "dinner",
        "lunch",
        "main course",
        "main dish",
        "casserole",
      ],
      "side-dish": ["side", "side dish", "accompaniment"],
      salad: ["salad"],
      soup: ["soup", "stew", "chili", "bisque", "broth"],
      bread: ["bread", "roll", "biscuit", "muffin", "bagel"],
      dessert: [
        "dessert",
        "sweet",
        "cake",
        "cookie",
        "pie",
        "pudding",
        "ice cream",
      ],
      beverage: ["drink", "beverage", "cocktail", "smoothie", "juice"],
    };

    const textLower = text.toLowerCase();

    for (const [category, keywords] of Object.entries(categoryMap)) {
      for (const keyword of keywords) {
        if (textLower.includes(keyword)) {
          return category;
        }
      }
    }

    return "main-course"; // Default category
  }

  extractTags(text) {
    const tags = [];
    const textLower = text.toLowerCase();

    const tagKeywords = [
      "vegetarian",
      "vegan",
      "gluten-free",
      "dairy-free",
      "healthy",
      "quick",
      "easy",
      "comfort food",
      "holiday",
      "party",
      "kid-friendly",
      "spicy",
      "sweet",
      "savory",
      "italian",
      "mexican",
      "asian",
      "indian",
      "american",
      "french",
      "mediterranean",
      "bbq",
      "grilled",
      "baked",
      "fried",
      "steamed",
      "roasted",
      "chicken",
      "beef",
      "rice",
    ];

    for (const keyword of tagKeywords) {
      if (textLower.includes(keyword)) {
        tags.push(keyword);
      }
    }

    return tags;
  }

  extractDifficulty(text) {
    const textLower = text.toLowerCase();

    if (
      textLower.includes("easy") ||
      textLower.includes("simple") ||
      textLower.includes("quick")
    ) {
      return "easy";
    }
    if (
      textLower.includes("hard") ||
      textLower.includes("difficult") ||
      textLower.includes("advanced")
    ) {
      return "hard";
    }

    return "medium"; // Default
  }

  extractAuthor(text, fileName) {
    const patterns = [
      /(?:author|by|chef|recipe by):\s*(.+?)(?:\n|$)/i,
      /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1].trim().length > 2) {
        return match[1].trim();
      }
    }

    return "Family Collection"; // Default author
  }

  validateRecipe(recipe) {
    const required = [
      "title",
      "description",
      "ingredients",
      "instructions",
      "prepTime",
      "cookTime",
      "servings",
      "category",
      "author",
    ];

    for (const field of required) {
      if (!recipe[field]) return false;
      if (Array.isArray(recipe[field]) && recipe[field].length === 0)
        return false;
    }

    return (
      this.validCategories.includes(recipe.category) &&
      this.validDifficulties.includes(recipe.difficulty) &&
      recipe.prepTime > 0 &&
      recipe.cookTime > 0 &&
      recipe.servings > 0
    );
  }

  getValidationIssues(recipe) {
    const issues = [];
    const required = [
      "title",
      "description",
      "ingredients",
      "instructions",
      "prepTime",
      "cookTime",
      "servings",
      "category",
      "author",
    ];

    required.forEach((field) => {
      if (!recipe[field]) issues.push(`Missing ${field}`);
      if (Array.isArray(recipe[field]) && recipe[field].length === 0)
        issues.push(`Empty ${field} array`);
    });

    if (!this.validCategories.includes(recipe.category))
      issues.push(`Invalid category: ${recipe.category}`);
    if (!this.validDifficulties.includes(recipe.difficulty))
      issues.push(`Invalid difficulty: ${recipe.difficulty}`);
    if (recipe.prepTime <= 0) issues.push("Invalid prep time");
    if (recipe.cookTime <= 0) issues.push("Invalid cook time");
    if (recipe.servings <= 0) issues.push("Invalid servings");

    return issues;
  }
}

// Main execution function
async function main() {
  console.log("🍳 Family Cookbook Recipe Parser Starting...\n");

  // Set up paths relative to the script location
  const recipesFolder = path.join(__dirname, "..", "..", "recipes");
  const outputFile = path.join(__dirname, "..", "temp", "parsed-recipes.json");
  const errorLogFile = path.join(__dirname, "..", "temp", "parsing-errors.log");

  console.log(`📁 Recipes folder: ${recipesFolder}`);
  console.log(`💾 Output file: ${outputFile}`);

  // Check if recipes folder exists
  if (!fs.existsSync(recipesFolder)) {
    console.error(`❌ Recipes folder not found: ${recipesFolder}`);
    console.log(
      "Please create the recipes folder and add your Word documents there."
    );
    process.exit(1);
  }

  const parser = new RecipeParser();
  const { recipes, errors } = await parser.parseRecipesFromFolder(
    recipesFolder
  );

  console.log("\n📊 Parsing Results:");
  console.log(`✅ Successfully parsed: ${recipes.length} recipes`);
  console.log(`❌ Errors: ${errors.length}`);

  // Save error log
  if (errors.length > 0) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      totalErrors: errors.length,
      errors: errors,
    };

    fs.writeFileSync(errorLogFile, JSON.stringify(errorLog, null, 2));
    console.log(`\n❌ Error details saved to: ${errorLogFile}`);

    console.log("\n❌ Errors encountered:");
    errors.forEach((error) => {
      console.log(`  - ${error.file}: ${error.error}`);
    });
  }

  // Save results
  if (recipes.length > 0) {
    fs.writeFileSync(outputFile, JSON.stringify(recipes, null, 2));
    console.log(`\n💾 Saved ${recipes.length} recipes to: ${outputFile}`);

    // Also save a summary
    const summary = recipes.map((r) => ({
      title: r.title,
      category: r.category,
      difficulty: r.difficulty,
      ingredients: r.ingredients.length,
      instructions: r.instructions.length,
      prepTime: r.prepTime,
      cookTime: r.cookTime,
      servings: r.servings,
    }));

    console.log("\n📝 Recipe Summary:");
    summary.forEach((s) => {
      console.log(`  - ${s.title} (${s.category}, ${s.difficulty})`);
      console.log(
        `    ${s.ingredients} ingredients, ${s.instructions} steps, ${
          s.prepTime + s.cookTime
        }min total`
      );
    });

    console.log("\n🎯 Next Steps:");
    console.log("1. Review the parsed recipes in:", outputFile);
    console.log(
      "2. Use the admin API to bulk upload: POST /api/admin/bulk-recipes"
    );
    console.log("3. Or manually review and adjust any recipes as needed");
  } else {
    console.log("\n⚠️  No recipes were successfully parsed.");
    console.log(
      "Please check the error log and your Word document formatting."
    );
  }

  console.log("\n🎉 Parsing complete!");
}

// Export for use in other scripts
module.exports = RecipeParser;

// Run the parser if executed directly
if (require.main === module) {
  main().catch(console.error);
}

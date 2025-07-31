# Admin API Documentation

## Authentication

All admin endpoints require the passphrase "Jake is awesome!" to be included either as:

- Header: `x-admin-passphrase: Jake is awesome!`
- Body parameter: `{ "passphrase": "Jake is awesome!" }`

## Endpoints

### 1. Bulk Create Recipes

**POST** `/api/admin/bulk-recipes`

Create multiple recipes at once.

**Headers:**

```
Content-Type: application/json
x-admin-passphrase: Jake is awesome!
```

**Request Body:**

```json
{
  "recipes": [
    {
      "title": "Recipe Title",
      "description": "Recipe description",
      "ingredients": [
        { "name": "Ingredient 1", "amount": "1", "unit": "cup" },
        { "name": "Ingredient 2", "amount": "2", "unit": "tablespoons" }
      ],
      "instructions": [
        { "description": "Step 1 instructions" },
        { "description": "Step 2 instructions" }
      ],
      "prepTime": 15,
      "cookTime": 30,
      "servings": 4,
      "category": "main-course",
      "difficulty": "medium",
      "author": "Chef Name",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully created 5 recipes",
  "data": [...],
  "count": 5
}
```

### 2. Delete All Recipes

**DELETE** `/api/admin/all-recipes`

⚠️ **WARNING: This deletes ALL recipes in the database!**

**Headers:**

```
x-admin-passphrase: Jake is awesome!
```

**Response:**

```json
{
  "success": true,
  "message": "Deleted 15 recipes",
  "deletedCount": 15
}
```

### 3. Get Admin Statistics

**GET** `/api/admin/stats`

Get database statistics and analytics.

**Headers:**

```
x-admin-passphrase: Jake is awesome!
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalRecipes": 25,
    "recipesByCategory": [
      { "_id": "main-course", "count": 10 },
      { "_id": "dessert", "count": 8 },
      { "_id": "appetizer", "count": 7 }
    ],
    "recipesByDifficulty": [
      { "_id": "easy", "count": 15 },
      { "_id": "medium", "count": 8 },
      { "_id": "hard", "count": 2 }
    ]
  }
}
```

### 4. Seed Sample Data

**POST** `/api/admin/seed-sample-data`

Add predefined sample recipes to the database.

**Headers:**

```
x-admin-passphrase: Jake is awesome!
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully seeded 3 sample recipes",
  "data": [...],
  "count": 3
}
```

## Usage Examples

### Using curl to bulk upload:

```bash
curl -X POST http://localhost:5000/api/admin/bulk-recipes \
  -H "Content-Type: application/json" \
  -H "x-admin-passphrase: Jake is awesome!" \
  -d '{
    "recipes": [
      {
        "title": "Test Recipe",
        "description": "A test recipe",
        "ingredients": [{"name": "Test ingredient", "amount": "1", "unit": "cup"}],
        "instructions": [{"description": "Test instruction"}],
        "category": "other"
      }
    ]
  }'
```

### Using curl to get stats:

```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "x-admin-passphrase: Jake is awesome!"
```

### Using curl to seed sample data:

```bash
curl -X POST http://localhost:5000/api/admin/seed-sample-data \
  -H "x-admin-passphrase: Jake is awesome!"
```

## Security Notes

- The admin passphrase is the same as the recipe creation passphrase
- In production, consider using proper JWT tokens and role-based authentication
- The delete all recipes endpoint should be used with extreme caution
- Consider adding rate limiting for admin endpoints

# Family Cookbook

A full-stack web application for managing and sharing family recipes, built with React and Node.js.

## Project Structure

```
family-cookbook/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/
├── backend/           # Node.js + Express API
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── node_modules/
└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js (14+ recommended)
- MongoDB (running locally or remote connection)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd family-cookbook
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   npm start
   ```

   The API will run on `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The React app will run on `http://localhost:3000`

## Features

- ✅ Create, read, update, and delete recipes
- ✅ Categorize recipes (appetizer, main course, dessert, etc.)
- ✅ Add ingredients with amounts and units
- ✅ Step-by-step cooking instructions
- ✅ Search and filter recipes
- ✅ Responsive design for mobile and desktop
- ✅ MongoDB database storage
- ✅ RESTful API endpoints

## API Endpoints

- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:id` - Get single recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/search/:query` - Search recipes
- `GET /api/recipes/category/:category` - Get recipes by category

## Technologies Used

### Frontend

- React 19
- CSS3 with modern layouts
- Fetch API for HTTP requests

### Backend

- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- CORS middleware
- dotenv for environment variables

## Development

### Frontend Development

```bash
cd frontend
npm start          # Start development server
npm test           # Run tests
npm run build      # Build for production
```

### Backend Development

```bash
cd backend
npm start          # Start production server
npm run dev        # Start with nodemon (auto-restart)
```

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

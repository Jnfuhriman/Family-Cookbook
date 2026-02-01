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

## Deployment

This project uses a split deployment strategy:
- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Railway

### Frontend Deployment (Vercel)

The frontend React application is automatically deployed to Vercel through the configured [vercel.json](vercel.json) file.

#### Automatic Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Automatic Builds**: Vercel automatically deploys on every push to main branch
3. **Build Configuration**: Defined in `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "build" }
       }
     ],
     "buildCommand": "cd frontend && npm install && npm run build",
     "outputDirectory": "frontend/build"
   }
   ```

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel --prod
```

### Backend Deployment (Railway)

The backend Node.js API is deployed to Railway using the [railway.toml](backend/railway.toml) configuration.

#### Automatic Deployment
1. **Connect Repository**: Link your GitHub repository to Railway
2. **Configure Service**: Point Railway to the `/backend` directory
3. **Environment Variables**: Set up in Railway dashboard:
   - `MONGODB_URI` - MongoDB connection string
   - `PORT` - Automatically provided by Railway
   - Any other environment variables from `.env`

#### Railway Configuration
The `backend/railway.toml` file contains:
```toml
[build]
  command = "npm install"

[deploy]
  startCommand = "npm start"
```

#### Manual Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Environment Variables

#### Frontend (.env files)
- **Development**: Uses `http://localhost:5000/api`
- **Production**: Uses Railway backend URL `https://family-cookbook-backend-production.up.railway.app/api`

#### Backend
Required environment variables for Railway:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000  # Automatically set by Railway
NODE_ENV=production
```

### Deployment Checklist

Before deploying:

**Frontend (Vercel)**
- [ ] Ensure `.env.production` has correct backend API URL
- [ ] Test build locally: `cd frontend && npm run build`
- [ ] Verify all dependencies are in `package.json`

**Backend (Railway)**
- [ ] Set up MongoDB database (MongoDB Atlas recommended)
- [ ] Configure environment variables in Railway dashboard
- [ ] Test server locally: `cd backend && npm start`
- [ ] Ensure `railway.toml` is configured correctly

**Post-Deployment**
- [ ] Test API endpoints from deployed backend
- [ ] Verify frontend can communicate with deployed backend
- [ ] Check all features work in production environment

### Monitoring & Logs

- **Vercel**: Check deployment logs and function logs in Vercel dashboard
- **Railway**: Monitor application logs and metrics in Railway dashboard
- **Frontend Errors**: Use browser developer tools and any error tracking service
- **Backend Logs**: Available in Railway dashboard under deployments

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

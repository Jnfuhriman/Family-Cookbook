import "./styles/App.css";
import CreateRecipeButton from "./components/CreateRecipeButton";

function App() {
  const handleRecipeCreated = (newRecipe) => {
    console.log("New recipe created:", newRecipe);
    // You can add logic here to refresh recipe list, show notifications, etc.
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Family Cookbook</h1>
        <p>Create and manage your family's favorite recipes</p>

        <div className="app-actions">
          <CreateRecipeButton onRecipeCreated={handleRecipeCreated} />
        </div>

        <div className="app-info">
          <p>
            Click the "Add New Recipe" button above to start building your
            cookbook!
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;

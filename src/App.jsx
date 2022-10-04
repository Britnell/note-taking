import { useQuery } from "@tanstack/react-query";
import { getNotes, getUsers } from "./notes/api";
import "./App.css";
import List from "./notes/list";

function App() {
  useQuery(["notes"], getNotes);
  useQuery(["users"], getUsers);

  return (
    <div className="App">
      <h1>App</h1>
      <div>
        <h2>YOur notes</h2>
        <List />
      </div>
      <div></div>
    </div>
  );
}

export default App;

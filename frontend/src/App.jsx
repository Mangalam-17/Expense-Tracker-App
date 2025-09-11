import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddTransaction />} />
        <Route path="/edit/:id" element={<EditTransaction />} />
      </Routes>
    </Router>
  );
}

export default App;

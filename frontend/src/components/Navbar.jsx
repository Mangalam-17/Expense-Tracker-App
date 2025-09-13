import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-700 text-white flex justify-between items-center px-5 py-2 shadow-md z-50 h-12">
      <Link to="/" className="text-lg font-bold">
        Expense Tracker
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {/* User icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <span className="text-sm font-semibold">{user?.name || "User"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-semibold transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

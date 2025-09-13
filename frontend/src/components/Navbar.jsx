import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UserIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-6 py-3 z-50 h-14">
      <Link
        to="/"
        className="text-xl font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition duration-200 ease-in-out"
      >
        Expense Tracker
      </Link>

      <div className="flex items-center gap-5">
        <motion.div
          className="flex items-center gap-2 text-gray-700 font-medium select-none cursor-default"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <UserIcon
            className="h-6 w-6 text-gray-600 transition-colors duration-200 ease-in-out"
            aria-hidden="true"
          />
          <span className="text-base leading-tight">
            {user?.name || "User"}
          </span>
        </motion.div>

        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.95 }}
          className="rounded-md px-4 py-1 text-gray-900 font-semibold border border-gray-300 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm hover:shadow-md"
          type="button"
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;

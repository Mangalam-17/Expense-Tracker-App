import { useState, useContext, useEffect, useCallback } from "react";
import { Navigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Typewriter } from "react-simple-typewriter";
import Confetti from "react-confetti";

const LoginPage = () => {
  const { login, user, token, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return null;
  if (user && token) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      setSubmitting(false);
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
    }),
  };

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: "#F9FAFB" },
          fpsLimit: 60,
          particles: {
            number: { value: 40, density: { enable: true, area: 800 } },
            color: { value: "#9CA3AF" },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: { min: 1, max: 3 }, random: true },
            move: { enable: true, speed: 1.5 },
            links: {
              enable: true,
              distance: 150,
              color: "#D1D5DB",
              opacity: 0.3,
              width: 1,
            },
          },
          interactivity: {
            detectsOn: "canvas",
            events: { onHover: { enable: true, mode: "repulse" } },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6 relative z-10">
        {/* Branding above card */}
        <motion.div
          className="text-center mb-10 max-w-md w-full"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={0}
        >
          <h1 className="text-5xl font-extrabold text-neutral-900 tracking-tight mb-1">
            Expense Tracker
          </h1>
          <span className="text-sm text-neutral-500 block">
            <Typewriter
              words={[
                "Easily manage your money.",
                "Track your income and expenses.",
                "Take control of your finances.",
              ]}
              loop
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </span>
        </motion.div>

        {/* Form card */}
        <motion.div
          className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full border border-neutral-200"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          <motion.h2
            className="text-4xl font-extrabold text-center text-neutral-900 mb-8 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Welcome Back 👋
          </motion.h2>

          {error && (
            <motion.div
              className="mb-6 text-red-700 bg-red-100 border border-red-300 p-3 rounded text-center font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {["email", "password"].map((field, idx) => (
              <motion.input
                key={field}
                type={field}
                name={field}
                placeholder={field === "email" ? "Email Address" : "Password"}
                value={form[field]}
                onChange={handleChange}
                required
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 2) * 0.2 }}
                className="w-full px-4 py-3 border border-neutral-300 rounded-md bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
              />
            ))}

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition duration-300 ease-in-out
                ${
                  submitting
                    ? "bg-neutral-400 cursor-not-allowed shadow-sm"
                    : "bg-neutral-900 hover:bg-neutral-800 shadow-lg"
                }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4 * 0.2 }}
            >
              {submitting ? "Logging In..." : "Login"}
            </motion.button>
          </form>

          <motion.p
            className="mt-8 text-center text-neutral-500 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.5 * 0.2 }}
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-neutral-900 font-medium hover:text-neutral-800 hover:bg-neutral-200 hover:rounded transition px-1"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;

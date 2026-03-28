import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const particlesOptions = {
    background: { color: "transparent" },
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" } },
    },
    particles: {
      color: { value: "#00b33c" },
      links: { enable: true, color: "#00b33c" },
      move: { enable: true, speed: 1 },
      number: { value: 50 },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 5 } },
    },
    detectRetina: true,
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Particle background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 -z-10"
      />

      {/* Theme toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 px-4 py-2 rounded-lg border border-primary dark:border-primaryDark text-primary dark:text-primaryDark hover:bg-primary hover:text-white transition"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center justify-center text-center px-6 pt-32 md:pt-48"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-primary dark:text-primaryDark drop-shadow-lg">
          Finance 4All
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
          Making financial education accessible, interactive, and fun for
          everyone.
        </p>

        {/* Reach Us Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-4 rounded-xl bg-primary dark:bg-primaryDark text-white font-semibold shadow-lg hover:shadow-xl transition"
          onClick={() =>
            (window.location.href = "mailto:financeforalledu@gmail.com")
          }
        >
          Reach Us
        </motion.button>
      </motion.div>

      {/* Wave Section */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-40 md:h-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#00b33c"
            fillOpacity="0.2"
            d="M0,64L48,69.3C96,75,192,85,288,112C384,139,480,181,576,197.3C672,213,768,203,864,192C960,181,1056,171,1152,165.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="mt-32 md:mt-48 px-6 max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center"
      >
        {[
          {
            title: "Easy Learning",
            desc: "Interactive modules for beginners to advanced learners.",
          },
          {
            title: "Global Access",
            desc: "Learn finance anytime, anywhere, on any device.",
          },
          {
            title: "Community Support",
            desc: "Join a vibrant community of learners and mentors.",
          },
        ].map((feature) => (
          <motion.div
            key={feature.title}
            whileHover={{ y: -5 }}
            className="p-8 border rounded-2xl bg-white dark:bg-gray-800 hover:shadow-xl transition"
          >
            <h3 className="text-2xl font-bold text-primary dark:text-primaryDark">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

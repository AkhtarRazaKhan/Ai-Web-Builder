import {
  ArrowRight,
  Sparkles,
  Zap,
  LayoutTemplate,
  Download,
  LockKeyhole,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleStartBuilding = () => {
    // User login nahi hai
    if (!userData) {
      setShowLoginPopup(true);
      return;
    }

    // User login hai
    navigate("/generate");
  };

  return (
    <>
      <Navbar />

      <section className="relative min-h-screen bg-[#050505] text-white overflow-hidden">

        {/* ================= LOGIN POPUP ================= */}
        <AnimatePresence>
          {showLoginPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
              onClick={() => setShowLoginPopup(false)}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                }}
                transition={{
                  duration: 0.25,
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.8)]"
              >

                {/* Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-indigo-500/20 blur-[80px]" />

                {/* Close button */}
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-white transition"
                >
                  <X size={19} />
                </button>

                {/* Icon */}
                <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-400/20">
                  <LockKeyhole
                    size={25}
                    className="text-indigo-400"
                  />
                </div>

                {/* Content */}
                <div className="relative text-center">

                  <h3 className="text-xl font-semibold text-white">
                    Login Required
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Please log in to your account to start
                    building your website with AI.
                  </p>

                  {/* Login button */}
                  <button
                    onClick={() => {
                      setShowLoginPopup(false);
                    }}
                    className="mt-6 w-full rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.98]"
                  >
                    Continue to Login
                  </button>

                  {/* Cancel */}
                  <button
                    onClick={() => setShowLoginPopup(false)}
                    className="mt-3 w-full rounded-xl px-5 py-2.5 text-sm text-gray-500 transition hover:text-white"
                  >
                    Maybe Later
                  </button>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= GLOW BACKGROUND ================= */}
        <div className="absolute inset-0 pointer-events-none">

          <div className="absolute -top-40 -left-40 w-125 h-125 bg-indigo-600/20 rounded-full blur-[140px]" />

          <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-600/20 rounded-full blur-[140px]" />

        </div>

        {/* ================= GRID BACKGROUND ================= */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff15 1px, transparent 1px), linear-gradient(to bottom, #ffffff15 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* ================= MAIN CONTENT ================= */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />

            <span className="text-sm text-gray-300">
              AI Website Builder
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            Build Websites with
            <br />

            <span className="bg-linear-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              AI in Seconds
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mt-6 text-lg text-gray-400"
          >
            Generate stunning, responsive websites instantly using AI.
            No coding required. Perfect for startups, creators and freelancers.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
          >
            <button
              onClick={handleStartBuilding}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold transition"
            >
              Start Building

              <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">

            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-indigo-400 transition">

              <Zap className="text-yellow-400 mb-4" />

              <h3 className="font-semibold text-lg mb-2">
                Instant Generation
              </h3>

              <p className="text-sm text-gray-400">
                Describe your website and AI generates it instantly.
              </p>

            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-indigo-400 transition">

              <LayoutTemplate className="text-indigo-400 mb-4" />

              <h3 className="font-semibold text-lg mb-2">
                Responsive Layout
              </h3>

              <p className="text-sm text-gray-400">
                Websites look perfect on mobile, tablet and desktop.
              </p>

            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-indigo-400 transition">

              <Download className="text-green-400 mb-4" />

              <h3 className="font-semibold text-lg mb-2">
                Export Code
              </h3>

              <p className="text-sm text-gray-400">
                Download clean HTML, CSS and JS instantly.
              </p>

            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default Home;

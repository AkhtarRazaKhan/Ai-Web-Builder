import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const LoginModal = ({ open, onClose }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleAuth = async () => {
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            // --------------------------------
            // 1. Firebase Google Login
            // --------------------------------
            const result = await signInWithPopup(
                auth,
                provider
            );

            const user = result.user;

            if (!user) {
                throw new Error(
                    "Firebase user not found."
                );
            }

            console.log("Firebase user:", {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL,
            });

            // --------------------------------
            // 2. Create backend payload
            // --------------------------------
            const payload = {
                name:
                    user.displayName ||
                    "Google User",

                email: user.email,

                avatar:
                    user.photoURL || "",
            };

            console.log(
                "Sending payload to backend:",
                payload
            );

            // --------------------------------
            // 3. Send user data to backend
            // --------------------------------
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/google`,
                payload,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            console.log(
                "Backend response:",
                response.data
            );

            // --------------------------------
            // 4. Save user in Redux
            // --------------------------------
            dispatch(
                setUserData(response.data)
            );

            // --------------------------------
            // 5. Close modal
            // --------------------------------
            onClose();

        } catch (error) {
            console.error(
                "Google authentication error:",
                error
            );

            console.error(
                "Backend error response:",
                error?.response?.data
            );

            // Firebase popup closed
            if (
                error?.code ===
                "auth/popup-closed-by-user"
            ) {
                setError(
                    "Google login popup was closed."
                );
            }

            // Firebase duplicate popup
            else if (
                error?.code ===
                "auth/cancelled-popup-request"
            ) {
                setError(
                    "Google login is already in progress."
                );
            }

            // Backend error
            else if (
                error?.response?.data?.message
            ) {
                setError(
                    error.response.data.message
                );
            }

            // Generic error
            else {
                setError(
                    error?.message ||
                    "Google login failed."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
        >
            <motion.div
                initial={{
                    scale: 0.88,
                    opacity: 0,
                    y: 60,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                }}
                exit={{
                    scale: 0.9,
                    opacity: 0,
                    y: 40,
                }}
                transition={{
                    duration: 0.45,
                    ease: "easeOut",
                }}
                className="relative w-full max-w-md p-px rounded-3xl bg-linear-to-br from-purple-500/40 via-blue-500/30 to-transparent"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >
                <div className="relative overflow-hidden rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">

                    {/* Purple Glow */}
                    <motion.div
                        animate={{
                            opacity: [
                                0.25,
                                0.4,
                                0.25,
                            ],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                        }}
                        className="absolute -top-32 -left-32 w-80 h-80 bg-purple-500/30 blur-[140px]"
                    />

                    {/* Blue Glow */}
                    <motion.div
                        animate={{
                            opacity: [
                                0.2,
                                0.35,
                                0.2,
                            ],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            delay: 2,
                        }}
                        className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/25 blur-[140px]"
                    />

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition disabled:opacity-50"
                    >
                        <X />
                    </button>

                    <div className="relative px-8 pt-14 pb-10 text-center">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur">
                            <Sparkles className="w-4 h-4 text-purple-400" />

                            <span className="text-sm text-gray-300">
                                AI Website Builder
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl font-semibold leading-tight mb-3">
                            <span className="text-white">
                                Welcome to{" "}
                            </span>

                            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                Dora ai
                            </span>
                        </h2>

                        {/* Google Button */}
                        <motion.button
                            type="button"
                            onClick={handleGoogleAuth}
                            disabled={loading}
                            whileHover={
                                !loading
                                    ? { scale: 1.04 }
                                    : {}
                            }
                            whileTap={
                                !loading
                                    ? { scale: 0.96 }
                                    : {}
                            }
                            className="group relative w-full h-13 rounded-xl bg-white text-black font-semibold shadow-xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <div className="relative flex items-center justify-center gap-3">

                                {!loading && (
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png"
                                        alt="Google"
                                        className="h-5 w-5"
                                    />
                                )}

                                {loading
                                    ? "Signing in..."
                                    : "Continue with Google"}
                            </div>
                        </motion.button>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                                <p className="text-sm text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-10">
                            <div className="h-px flex-1 bg-white/10" />

                            <span className="text-xs tracking-tight text-zinc-500">
                                Secure Login
                            </span>

                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            By continuing you agree to our{" "}
                            <span className="underline cursor-pointer hover:text-zinc-300">
                                Terms of Services
                            </span>{" "}
                            and{" "}
                            <span className="underline cursor-pointer hover:text-zinc-300">
                                Privacy Policy
                            </span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LoginModal;

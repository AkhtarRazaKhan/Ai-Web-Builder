import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const PHASES = [
    "Analyzing your idea...",
    "Designing layout and structure...",
    "Writing HTML and CSS...",
    "Adding animation and interaction...",
    "Final quality checks..."
]

const Generate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const {userData} = useSelector(state=>state.user)

    const handleGenerateWebsite = async () => {

        try {

            setLoading(true)

            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )

            setProgress(100)
            console.log(res)
            dispatch(setUserData({...userData, credits:res.data.remainingCredits}))
            navigate(`/editor/${res.data.websiteId}`)

        } catch (error) {

            setError(error.response?.data?.message || "Something went wrong")

        } finally {

            setLoading(false)

        }

    }

    useEffect(() => {

        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {

            const increment =
                value < 20
                    ? Math.random() * 1.5
                    : value < 60
                        ? Math.random() * 1.2
                        : Math.random() * 0.6

            value += increment

            if (value >= 93) value = 93

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length),
                PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)

        }, 1200)

        return () => clearInterval(interval)

    }, [loading])

    return (

        <div className='relative min-h-screen bg-[#050505] text-white overflow-hidden'>

            {/* Falling Light Effect */}
            <div className='pointer-events-none absolute inset-0'>

                {/* beam */}
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-100 h-100 
                bg-linear-to-b from-white/20 via-white/10 to-transparent 
                blur-3xl opacity-40'/>

                {/* center glow */}
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-100 h-100 
                bg-white/20 rounded-full blur-[150px]' />

            </div>

            {/* header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => navigate("/")}
                            className="p-2 rounded-lg hover:bg-white/10 transition"
                        >
                            <ArrowLeft size={16} />
                        </button>

                        <h1 className="text-lg font-semibold">Dora AI</h1>

                    </div>

                </div>

            </div>

            <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-16'
                >

                    <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
                        Build Website with

                        <span className='block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
                            Real AI Power
                        </span>

                    </h1>

                    <p className='text-zinc-400 max-w-2xl mx-auto'>
                        This process may take several minutes. Dora AI focuses on quality not shortcuts
                    </p>

                </motion.div>

                <div className='mb-10'>

                    <h1 className='text-xl font-semibold mb-2'>
                        Describe Your Website
                    </h1>

                    <div className='relative'>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20'
                            placeholder='Describe your website in detail...'
                        />

                    </div>

                    {error && (
                        <p className='mt-4 text-sm text-red-400'>
                            {error}
                        </p>
                    )}

                </div>

                <div className='flex justify-center'>

                    <motion.button
                        onClick={handleGenerateWebsite}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={!prompt.trim() || loading}
                        className={`px-14 py-4 rounded-2xl font-semibold text-lg transition
                        ${
                            prompt.trim() && !loading
                                ? "bg-white text-black"
                                : "bg-white/20 text-zinc-400 cursor-not-allowed"
                        }`}
                    >

                        Generate Website

                    </motion.button>

                </div>

                {loading && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='max-w-xl mx-auto mt-12'
                    >

                        <div className='flex justify-between mb-2 text-xs text-zinc-400'>
                            <span>{PHASES[phaseIndex]}</span>
                            <span>{progress}%</span>
                        </div>

                        <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>

                            <motion.div
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.8 }}
                                className='h-full bg-linear-to-r from-white to-zinc-300'
                            />

                        </div>

                        <div className='text-center text-xs text-zinc-400 mt-4'>

                            Estimated time remaining:{" "}
                            <span className='text-white font-medium'>
                                ~8-12 minutes
                            </span>

                        </div>

                    </motion.div>

                )}

            </div>

        </div>
    )
}

export default Generate
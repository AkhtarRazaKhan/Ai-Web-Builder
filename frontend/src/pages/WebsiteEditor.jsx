import axios from 'axios'
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react';

const WebsiteEditor = () => {
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const { id } = useParams()
    const iframeRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const thinkingSteps = [
        "Understanding your request...",
        "Planning layout changes...",
        "Improving responsiveness...",
        "Applying animations...",
        "Finalizing Update..."
    ]

    const handleDeploy = async (id) => {
    try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${website._id}`,{withCredentials:true})
         window.open(`${result.data.url}`,"_blank")
         
    } catch (error) {
         console.log(error)
    }
  }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 1200)
        return () => clearInterval(intervalId)
    }, [updateLoading])

    const handleUpdate = async () => {
        setMessages((m) => [...m, { role: "user", content: prompt }])
        setUpdateLoading(true)
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/website/update/${id}`, { prompt }, { withCredentials: true })
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            console.log(error)
        } finally {
            setUpdateLoading(false)
        }
    }

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getbyid/${id}`, { withCredentials: true })
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
            } catch (error) {
                setError(error.response.data.message)
                console.log(error)
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>{error}</div>
        )
    }
    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>Loading...</div>
        )
    }
    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            <aside className='hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80'>
                <Header />
                <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((m, i) => {
                            return <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed 
                            ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        })}
                        {updateLoading && <div className='max-w-[85%] mr-auto'>
                            <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                        </div>}
                    </div>

                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={1}
                                placeholder='Describe changes...'
                                className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-outline-none' />
                            <button disabled={updateLoading} onClick={handleUpdate} className='px-4 py-3 rounded-2xl bg-white text-black'><Send size={18} /></button>
                        </div>
                    </div>
                </>
            </aside>

            {/* preview */}
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <span className='text-xs text-zinc-400'>Live Preview</span>
                    <div className='flex gap-2'>
                        {website.deployed ? "": <button 
                        onClick={handleDeploy}
                        className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition'><Rocket size={14} />Deploy</button>}
                      
                        <button onClick={() => setShowChat(true)} className='p-2 lg:hidden'><MessageSquare size={18} /></button>
                        <button onClick={() => setShowCode(true)} className='p-2'><Code2 size={18} /></button>
                        <button onClick={() => setShowFullPreview(true)} className='p-2'><Monitor size={18} /></button>
                    </div>

                </div>
                <iframe ref={iframeRef} className='flex-1 w-full bg-white' sandbox='allow-scripts allow-same-origin allow-forms'/>
            </div>

            {/* mobile chat preview */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className='fixed inset-0 z-9999 flex flex-col bg-black'
                    >
                        <Header />
                        <>
                            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                                {messages.map((m, i) => {
                                    return <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed 
                            ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                })}
                                {updateLoading && <div className='max-w-[85%] mr-auto'>
                                    <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>
                                </div>}
                            </div>

                            <div className='p-3 border-t border-white/10'>
                                <div className='flex gap-2'>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        rows={1}
                                        placeholder='Describe changes...'
                                        className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-outline-none' />
                                    <button disabled={updateLoading} onClick={handleUpdate} className='px-4 py-3 rounded-2xl bg-white text-black'><Send size={18} /></button>
                                </div>
                            </div>
                        </>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-9999 flex flex-col bg-[#1e1e1e]'
                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
                            <span className='text-sm font-medium'>index.html</span>
                            <button onClick={() => setShowCode(false)}><X size={18} /></button>
                        </div>
                        <Editor theme='vs-dark' value={code} language='html' onChange={(v) => setCode(v)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div className='fixed inset-0 bg-black z-9999'>
                        <iframe className='w-full h-full bg-white' srcDoc={code} sandbox='allow-scripts allow-same-origin allow-forms'></iframe>
                        <button onClick={() => setShowFullPreview(false)} className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg'><X /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    function Header() {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
                <span className='font-semibold truncate'>{website.title}</span>
                <button onClick={()=>setShowChat(false)} className='lg:hidden'><X/></button>
            </div>
        )
    }


}

export default WebsiteEditor

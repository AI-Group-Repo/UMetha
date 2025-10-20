"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, X, Maximize2, Minimize2, Send, Loader2, ImagePlus, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"
import Image from "next/image"

// Quick action suggestions
const quickSuggestions = [
  "Find a dress for a wedding",
  "What's trending this season?",
  "Do you have eco-friendly options?",
  "Shipping to international locations",
  "Help me find my size"
]

export default function AiChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    { 
      text: "Hi there! I'm KB, your UMetha shopping assistant. How can I help you find the perfect items today?", 
      isBot: true,
      timestamp: new Date()
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)
  const { theme } = useTheme()
  const [chatHistory, setChatHistory] = useState([])
  const [isError, setIsError] = useState(false)
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to call the AI API
  const callChatAPI = async (userMessage) => {
    try {
      setIsError(false)
      
      // Prepare conversation history for context
      const conversation = chatHistory.map(msg => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.text
      }));
      
      // Add the new user message
      conversation.push({
        role: "user",
        content: userMessage
      });
      
      // Add system prompt to define the assistant's personality and knowledge
      conversation.unshift({
        role: "system",
        content: `You are a helpful and enthusiastic shopping assistant for UMetha, an online fashion and home decor retailer. 
        You help customers find products, answer questions about sizing, shipping, returns, and provide style advice.
        Be concise, friendly, and knowledgeable. If you don't know something specific about UMetha's inventory, 
        recommend general product categories we likely carry instead of making up specific products.
        Always encourage users to browse our collection on the website. Keep responses under 100 words.`
      });
      
      // Make API call to your backend endpoint that will forward to OpenAI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: conversation })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from chat API');
      }
      
      const data = await response.json();
      return data.message;
      
    } catch (error) {
      console.error('Error calling chat API:', error);
      setIsError(true);
      return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = { text: inputValue, isBot: false, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setChatHistory(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setShowSuggestions(false)

    try {
      // Get response from AI
      const aiResponse = await callChatAPI(userMessage.text)
      
      // Add bot response to messages
      const botResponse = { 
        text: aiResponse, 
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setChatHistory(prev => [...prev, botResponse])
      
    } catch (error) {
      console.error("Error in chat flow:", error)
      
      // Add error message
      setMessages(prev => [
        ...prev, 
        { 
          text: "Sorry, I'm having trouble connecting. Please try again.", 
          isBot: true, 
          isError: true,
          timestamp: new Date() 
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion)
    setTimeout(() => {
      handleSendMessage()
    }, 100) // Small delay to ensure state updates
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Floating button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
          }}
          className={cn(
            "fixed bottom-0 right-6 rounded-full h-20 w-20 shadow-lg z-50 flex items-center justify-center",
            isOpen && "hidden",
            "bg-[radial-gradient(circle,_#ffffff,_#eef1ff,_#d5e5ff,_#b3dbff,_#87d3fa)] shadow-blue-500 hover:from-indigo-700 hover:to-violet-700"
          )}
        >
          <Image 
            src="/KBLogo - PNG.png"
            alt="KB Assistant Logo"
            width={25}
            height={25}
            className="h-14 w-14 object-cover"
          />
        
        </Button>
        
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "600px",
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "fixed bottom-6 right-6 w-80 md:w-96 z-50 rounded-2xl shadow-2xl overflow-hidden",
              isMinimized && "h-auto",
            )}
          >
            <Card className="border border-indigo-200 dark:border-violet-800/50 h-full flex flex-col bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-violet-950/30">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 py-3 px-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-1.5">
                    <Bot className="h-5 w-5 text-indigo-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">UMetha Assistant</h3>
                    <p className="text-xs text-indigo-100">Fashion & Home Expert</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-indigo-100 hover:bg-white/10 hover:text-white"
                          onClick={() => setIsMinimized(!isMinimized)}
                        >
                          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">{isMinimized ? "Expand" : "Minimize"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-indigo-100 hover:bg-white/10 hover:text-white"
                          onClick={() => setIsOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">Close</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>

              {!isMinimized && (
                <>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div 
                          key={index} 
                          className={cn("flex", message.isBot ? "justify-start" : "justify-end")}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex flex-col max-w-[85%] gap-1">
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-2.5 shadow-sm",
                                message.isBot 
                                  ? "bg-white dark:bg-gray-800 text-foreground rounded-tl-none" 
                                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none",
                                message.isError && "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              )}
                            >
                              {message.text}
                            </div>
                            <span className="text-[10px] text-muted-foreground px-2">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isTyping && (
                        <motion.div 
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex flex-col max-w-[85%] gap-1">
                            <div className="rounded-2xl px-4 py-2.5 shadow-sm bg-white dark:bg-gray-800 text-foreground rounded-tl-none">
                              <div className="flex gap-1">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {showSuggestions && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                          className="flex flex-wrap gap-2 mt-4"
                        >
                          {quickSuggestions.map((suggestion, idx) => (
                            <Button 
                              key={idx} 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-violet-400 border-indigo-200 dark:border-violet-800/50 hover:bg-indigo-50 dark:hover:bg-violet-900/20 transition-all rounded-full"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </AnimatePresence>
                  </CardContent>

                  <CardFooter className="p-3 border-t border-indigo-100 dark:border-violet-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <form 
                      className="flex w-full items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                    >
                      <div className="relative flex-1">
                        <Input
                          placeholder="Type your message..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="pr-10 rounded-full border-indigo-200 dark:border-violet-800/50 focus:border-indigo-400 dark:focus:border-violet-500 bg-white dark:bg-gray-800"
                          disabled={isTyping}
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-indigo-400 dark:text-violet-400 hover:text-indigo-600 dark:hover:text-violet-300"
                                disabled={isTyping}
                              >
                                <ImagePlus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Upload Image</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Button 
                        size="icon" 
                        type="submit"
                        disabled={isTyping || !inputValue.trim()}
                        className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md"
                      >
                        {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </form>
                  </CardFooter>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
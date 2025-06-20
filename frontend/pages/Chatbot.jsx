import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "../components/ui/google-gemini-effect";

function ChatBot() {
	const [prompt, setPrompt] = useState("");
	const [messages, setMessages] = useState([
		{ role: "bot", text: "Hello! I can help you query your users database. Ask me anything!" }
	]);
	const [loading, setLoading] = useState(false);
	const messagesEndRef = useRef(null);

	// Auto-scroll to bottom
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleResponse = async () => {
		if (!prompt.trim() || loading) return;

		const userMessage = { role: "user", text: prompt };
		setMessages(prev => [...prev, userMessage]);
		setLoading(true);
		setPrompt("");

		try {
			const { data } = await axios.post("http://192.168.0.137:5000/api/chat", {
				question: prompt
			}, {
				timeout: 15000 // 15 second timeout
			});

			const botMessage = {
				role: "bot",
				text: data.answer || "I didn't understand that. Could you rephrase?"
			};
			setMessages(prev => [...prev, botMessage]);
		} catch (error) {
			console.error("API Error:", error);

			let errorMessage = "Error processing your request. Please try again.";

			if (error.code === 'ECONNABORTED') {
				errorMessage = "Request timed out. Please try again.";
			} else if (error.response) {
				errorMessage = error.response.data?.answer || errorMessage;
			} else if (error.request) {
				errorMessage = "Unable to connect to the server. Please check your connection.";
			}

			setMessages(prev => [...prev, {
				role: "bot",
				text: errorMessage
			}]);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleResponse();
		}
	};

	const ref = React.useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});

	const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
	const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
	const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
	const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
	const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

	return (
		<div className="max-w-[960px] mx-auto border border-blue-500 mt-20 rounded-lg p-4" ref={ref}>

			<h1 className="text-center text-3xl text-blue-500 font-semibold mb-10">Database Chat Assistant - built using Gemini API</h1>

			<div className="space-y-4 min-h-[400px] max-h-[400px] overflow-y-auto mb-4 flex flex-col">
				{/* <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <GoogleGeminiEffect
                        pathLengths={[
                            pathLengthFirst,
                            pathLengthSecond,
                            pathLengthThird,
                            pathLengthFourth,
                            pathLengthFifth,
                        ]}
                    />
                </div> */}
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`p-3 rounded-xl w-fit max-w-xl ${msg.role === 'user'
								? 'bg-blue-600 self-end ml-auto'
								: 'bg-[#26008f] self-start'
							}`}
					>
						<p className="text-gray-200 whitespace-pre-wrap">{msg.text}</p>
					</div>
				))}
				{loading && (
					<div className="bg-gray-100 p-3 rounded-xl w-fit max-w-full self-start">
						<p className="text-gray-500">Thinking...</p>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className="flex text-white items-center space-x-2">
				<input
					type="text"
					placeholder="Ask about users..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					onKeyDown={handleKeyDown}
					className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={loading}
				/>
				<button
					onClick={handleResponse}
					className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
					disabled={loading || !prompt.trim()}
				>
					Send
				</button>
			</div>
		</div>
	);
}

export default ChatBot;

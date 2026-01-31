"use client";

import {
	ChevronDown,
	Loader2,
	Menu,
	Mic,
	Plus,
	Send,
	Wrench,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import remarkGfm from "remark-gfm";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useWebLLM } from "@/hooks/use-web-llm";

const Home: React.FC = () => {
	const [openListeningModal, setOpenListeningModal] = useState(false);
	const {
		messages,
		input,
		setInput,
		handleSubmit,
		isLoading,
		isModelLoading,
		initializeEngine,
		engine,
	} = useWebLLM();

	const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
		useSpeechRecognition();

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	useEffect(() => {
		if (!engine) {
			initializeEngine();
		}
	}, [engine, initializeEngine]);

	// biome-ignore lint/suspicious/noExplicitAny: complex type
	const timerRef: any = useRef(null);

	useEffect(() => {
		if (transcript) {
			if (timerRef.current) clearTimeout(timerRef.current);

			timerRef.current = setTimeout(() => {
				setOpenListeningModal(false);
				setInput(transcript);
				handleSubmit();
				SpeechRecognition.stopListening();
				resetTranscript();
				console.log("Auto-stopped due to silence:", transcript);
			}, 1500);
		}

		return () => clearTimeout(timerRef.current);
	}, [transcript, setInput, handleSubmit, resetTranscript]);

	if (isModelLoading) {
		return (
			<div className="flex items-center justify-center h-screen flex-col bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-zinc-800">
				<Spinner className="h-12 w-12" />
				<p className="text-zinc-400">Deep Search is loading...</p>
			</div>
		);
	}
	if (!browserSupportsSpeechRecognition) {
		return <span>Browser doesn't support speech recognition.</span>;
	}
	return (
		<div className="flex h-screen flex-col bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-zinc-800">
			{/* Header */}
			<header className="flex h-14 items-center justify-between px-4 border-b border-zinc-800/40 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
					>
						<Menu className="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						className="flex items-center gap-2 font-semibold text-zinc-100 hover:bg-zinc-800/50 px-2"
					>
						Deep Search
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent p-4">
				<div className="mx-auto max-w-3xl py-4 md:py-8 space-y-6">
					{messages
						.filter((m) => m.role !== "system")
						.map((msg, idx) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: list is append-only
								key={idx}
								className={`flex w-full ${
									msg.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`relative max-w-[85%] ${
										msg.role === "user"
											? "px-4 py-2.5 bg-zinc-800 text-zinc-100 rounded-2xl rounded-tr-sm"
											: "text-zinc-300 leading-relaxed text-[0.95rem] pr-4"
									}`}
								>
									{msg.role === "assistant" && (
										<div className="flex items-center gap-2 mb-2">
											<div className="bg-blue-600 h-5 w-5 rounded-[4px] flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-1 ring-zinc-900/50">
												DS
											</div>
											<span className="text-xs font-semibold text-zinc-400">
												Deep Search
											</span>
										</div>
									)}

									<div
										className={`prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl max-w-none ${msg.role === "user" ? "prose-p:m-0" : ""}`}
									>
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											components={{
												code({
													node,
													inline,
													className,
													children,
													...props
													// biome-ignore lint/suspicious/noExplicitAny: complex type
												}: any) {
													return !inline ? (
														<div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 my-4 overflow-x-auto">
															<code
																className={`${className} text-sm font-mono`}
																{...props}
															>
																{children}
															</code>
														</div>
													) : (
														<code
															className="bg-zinc-800 px-1 py-0.5 rounded text-sm font-mono text-blue-200"
															{...props}
														>
															{children}
														</code>
													);
												},
											}}
										>
											{msg.content}
										</ReactMarkdown>
									</div>

									{/* Action Bar for Assistant */}
									{/* {msg.role === "assistant" && !isLoading && (
										<div className="flex items-center gap-1 text-zinc-500 mt-4 animate-in fade-in duration-300">
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors"
											>
												<ThumbsUp className="h-3.5 w-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors"
											>
												<ThumbsDown className="h-3.5 w-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors"
											>
												<Copy className="h-3.5 w-3.5" />
											</Button>
										</div>
									)} */}
								</div>
							</div>
						))}

					{isLoading && (
						<div className="flex w-full justify-start animate-in fade-in">
							<div className="flex items-center gap-2 text-zinc-400 bg-zinc-900/30 px-3 py-1.5 rounded-full border border-zinc-800/50">
								<Loader2 className="h-3.5 w-3.5 animate-spin" />
								<span className="text-xs font-medium">Thinking...</span>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</main>

			{/* Input Area */}
			<div className="p-4 pt-2 md:px-0 pb-6 w-full max-w-3xl mx-auto bg-[#0a0a0a]">
				<div className="relative rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-3 shadow-2xl shadow-black/50 ring-offset-2 ring-offset-transparent focus-within:ring-1 focus-within:ring-zinc-700/50 transition-all duration-300 hover:border-zinc-700/60 group">
					{/* Text Area */}
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Ask Deep Search..."
						className="min-h-[50px] w-full px-3 py-2 text-zinc-200 bg-transparent outline-none resize-none placeholder:text-zinc-500 font-medium"
						rows={1}
					/>

					<div className="flex items-center justify-between mt-2 px-1">
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="h-8 text-xs bg-zinc-800/40 border-zinc-700/50 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50 rounded-xl pl-2.5 pr-3 transition-all hover:border-zinc-600"
							>
								<Wrench className="mr-2 h-3.5 w-3.5" />
								Tools
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
							>
								<Plus className="h-5 w-5" />
							</Button>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex items-center text-xs text-zinc-500 font-medium cursor-pointer hover:text-zinc-300 transition-colors">
								Fast <ChevronDown className="ml-1 h-3 w-3" />
							</div>
							{input.trim() ? (
								<Button
									onClick={() => handleSubmit()}
									disabled={isLoading}
									size="icon"
									className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
								>
									{isLoading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Send className="h-4 w-4" />
									)}
								</Button>
							) : (
								<Button
									size="icon"
									className="h-9 w-9 rounded-full bg-zinc-800 text-zinc-500 cursor-pointer"
									onClick={() => {
										setOpenListeningModal(true);
										SpeechRecognition.startListening();
									}}
								>
									<Mic className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>

					<div className="absolute top-4 right-4 animate-in fade-in duration-700 pointer-events-none">
						<div className="bg-blue-600 h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-zinc-900/50">
							DS
						</div>
					</div>
				</div>
				<div className="mt-3 text-center text-[10px] text-zinc-600 font-medium">
					Deep Search can make mistakes, so double-check it
				</div>
			</div>
			{openListeningModal && (
				<AlertDialog
					open={openListeningModal}
					onOpenChange={setOpenListeningModal}
				>
					<AlertDialogContent className="w-[400px] h-[200px]">
						<AlertDialogHeader>
							<div className="flex items-center justify-between w-full">
								<AlertDialogTitle>Listening...</AlertDialogTitle>
								<X
									className="h-6 w-6 cursor-pointer"
									onClick={() => {
										setOpenListeningModal(false);
										SpeechRecognition.stopListening();
									}}
								/>
							</div>
						</AlertDialogHeader>
						<AlertDialogDescription className="flex items-center justify-center">
							<Mic className="h-10 w-10 text-zinc-200 bg-red-600 p-2 rounded-full animate-pulse" />
						</AlertDialogDescription>
						{transcript && <p className="text-zinc-200">{transcript}</p>}
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
};

export default Home;

"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";
import AssistentMessageItem from "@/components/AssistentMessageItem";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import { Spinner } from "@/components/ui/spinner";
import VoiceModal from "@/components/VoiceModal";
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
		progress,
		initializeEngine,
		engine,
		selectedModel,
		onSelectModel,
		availableModels,
	} = useWebLLM();

	const currentModel = availableModels.find((m) => m.id === selectedModel);

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages.length]);

	const timerRef = useRef<NodeJS.Timeout | null>(null);

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

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [transcript, setInput, handleSubmit, resetTranscript]);

	if (isModelLoading) {
		return (
			<div className="flex items-center justify-center h-screen flex-col bg-background text-foreground font-sans selection:bg-zinc-800">
				<div className="relative mb-8">
					<div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
					<Spinner className="h-16 w-16 relative z-10 text-blue-500" />
				</div>
				<h2 className="text-xl font-semibold mb-2">Powering up Deep Search</h2>
				<p className="text-muted-foreground animate-pulse">
					{currentModel?.type === "local"
						? "Downloading model to your browser..."
						: "Initializing cloud engine..."}
				</p>
				{progress && (
					<div className="mt-8 w-full max-w-md px-6">
						<div className="flex justify-between text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-bold">
							<span>Status</span>
							<span>Live</span>
						</div>
						<div className="p-3 rounded-xl bg-muted/50 border border-border/50 font-mono text-[11px] text-muted-foreground break-all leading-relaxed">
							{progress}
						</div>
					</div>
				)}
			</div>
		);
	}

	if (!browserSupportsSpeechRecognition) {
		return (
			<div className="flex items-center justify-center h-screen bg-background text-muted-foreground">
				Browser doesn't support speech recognition.
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col bg-background text-foreground font-sans selection:bg-secondary">
			<Header />

			{/* Main Content */}
			<main className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent p-4">
				<div className="mx-auto max-w-3xl py-4 md:py-8 space-y-6">
					{messages.map((msg, idx) => (
						<AssistentMessageItem
							key={`${msg.role}-${idx}`}
							role={msg.role}
							content={msg.content}
							isLoading={isLoading}
						/>
					))}

					{isLoading && (
						<div className="flex w-full justify-start animate-in fade-in slide-in-from-left-2 duration-500">
							<div className="flex items-center gap-3 text-muted-foreground bg-muted/40 px-4 py-2 rounded-2xl border border-transparent logo-loading-ring shadow-xl backdrop-blur-sm">
								<Loader2 className="h-4 w-4 animate-spin text-primary" />
								<span className="text-xs font-bold tracking-tight text-foreground/80 animate-pulse">
									Deep Search is thinking...
								</span>
							</div>
						</div>
					)}

					<div ref={messagesEndRef} />
				</div>
			</main>

			<ChatInput
				input={input}
				setInput={setInput}
				isLoading={isLoading}
				onSubmit={() => handleSubmit()}
				onKeyDown={handleKeyDown}
				onStartListening={() => {
					setOpenListeningModal(true);
					SpeechRecognition.startListening();
				}}
				selectedModel={selectedModel}
				onSelectModel={onSelectModel}
				availableModels={availableModels}
			/>

			<VoiceModal
				isOpen={openListeningModal}
				onOpenChange={setOpenListeningModal}
				transcript={transcript}
				onStopListening={() => {
					setOpenListeningModal(false);
					SpeechRecognition.stopListening();
				}}
			/>
		</div>
	);
};

export default Home;

import { CreateMLCEngine, type MLCEngineInterface } from "@mlc-ai/web-llm";
import { useCallback, useState } from "react";

const AVAILABLE_MODELS = [
	// --- CLOUD MODELS (API-based, Free Tier) ---
	{
		id: "gemini-flash-lite-latest",
		name: "Gemini Flash Lite (Cloud)",
		type: "cloud",
	},
	{
		id: "gemini-3-flash-preview",
		name: "Gemini 3 Flash (Cloud)",
		type: "cloud",
		description: "Latest 2026 speed-optimized model with agentic reasoning.",
	},
	{
		id: "gemini-3-pro-preview",
		name: "Gemini 3 Pro (Cloud)",
		type: "cloud",
		description: "Flagship reasoning model for complex coding & 1M context.",
	},
	{
		id: "gemini-2.5-flash-lite",
		name: "Gemini 2.5 Flash Lite (Cloud)",
		type: "cloud",
		description: "Ultra-low latency model for high-frequency tasks.",
	},
	{
		id: "gemini-2.5-pro",
		name: "Gemini 2.5 Pro (Cloud)",
		type: "cloud",
		description: "Highly stable multimodal model with deep reasoning.",
	},

	// --- LOCAL MODELS (WebLLM / Browser GPU) ---
	{
		id: "DeepSeek-R1-Distill-Llama-8B-q4f16_1-MLC",
		name: "DeepSeek R1 Distill Llama 8B (Local)",
		type: "local",
		description: "Powerful reasoning model with 'Thinking' mode.",
	},
	{
		id: "Llama-4-Scout-17B-16E-Instruct-q4f16_1-MLC",
		name: "Llama 4 Scout (Local)",
		type: "local",
		description: "Meta's newest 2026 efficient model for browser use.",
	},
	{
		id: "Llama-3.1-8B-Instruct-q4f32_1-MLC",
		name: "Llama 3.1 8B (Local)",
		type: "local",
		description: "Reliable general-purpose local model.",
	},
	{
		id: "gemma-3-4b-it-q4f16_1-MLC",
		name: "Gemma 3 4B (Local)",
		type: "local",
		description: "Google's latest 2026 lightweight open model.",
	},
	{
		id: "Phi-4-mini-instruct-q4f16_1-MLC",
		name: "Phi-4 Mini (Local)",
		type: "local",
		description: "Microsoft's efficient reasoning engine for mobile web.",
	},
	{
		id: "Qwen3-7B-Instruct-q4f16_1-MLC",
		name: "Qwen 3 7B (Local)",
		type: "local",
		description: "Excellent multilingual and coding support.",
	},
	{
		id: "SmolLM2-135M-Instruct-q8f16_1-MLC",
		name: "SmolLM2 135M (Local - Tiny)",
		type: "local",
		description: "Fastest download; perfect for low-end devices or testing.",
	},
];

interface Message {
	role: "system" | "user" | "assistant";
	content: string;
}

const useWebLLM = () => {
	const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
	const [progress, setProgress] = useState<string>("");
	const [selectedModel, setSelectedModel] = useState<string>(
		AVAILABLE_MODELS[0].id,
	);
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "system",
			content:
				"Welcome to Deep Search—your personal guide to the information that matters.",
		},
	]);
	const [input, setInput] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModelLoading, setIsModelLoading] = useState<boolean>(false);

	const initializeEngine = useCallback(async () => {
		const model = AVAILABLE_MODELS.find((m) => m.id === selectedModel);
		if (model?.type === "cloud") {
			setIsModelLoading(false);
			return;
		}

		if (engine) return;

		setIsModelLoading(true);
		try {
			const newEngine = await CreateMLCEngine(selectedModel, {
				initProgressCallback: (report) => {
					setProgress(report.text);
				},
			});
			setEngine(newEngine);
		} catch (error) {
			console.error("Failed to load model:", error);
			setProgress("Failed to load model. Please reload details.");
		} finally {
			setIsModelLoading(false);
		}
	}, [engine, selectedModel]);

	const onSelectModel = useCallback(
		async (modelId: string) => {
			if (engine) {
				await engine.unload();
			}
			setEngine(null);
			setSelectedModel(modelId);
		},
		[engine],
	);

	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		const model = AVAILABLE_MODELS.find((m) => m.id === selectedModel);

		try {
			// Cloud Model Handling
			if (model?.type === "cloud") {
				setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

				const response = await fetch("/api/chat", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						messages: [...messages, userMessage],
						model: selectedModel,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.error ||
							`API request failed with status ${response.status}`,
					);
				}
				if (!response.body) throw new Error("No response body");

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let assistantMessage = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value);
					assistantMessage += chunk;

					setMessages((prev) => {
						const newMessages = [...prev];
						const lastMsg = newMessages[newMessages.length - 1];
						if (lastMsg.role === "assistant") {
							lastMsg.content = assistantMessage;
						}
						return newMessages;
					});
				}
			}
			// Local Model Handling (WebLLM)
			else {
				if (!engine) return;

				const chunks = await engine.chat.completions.create({
					messages: [...messages, userMessage],
					stream: true,
				});

				let assistantMessage = "";
				setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

				for await (const chunk of chunks) {
					const content = chunk.choices[0]?.delta?.content || "";
					assistantMessage += content;

					setMessages((prev) => {
						const newMessages = [...prev];
						const lastMsg = newMessages[newMessages.length - 1];
						if (lastMsg.role === "assistant") {
							lastMsg.content = assistantMessage;
						}
						return newMessages;
					});
				}
			}
		} catch (error) {
			console.error("Chat error:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: `Error: ${error instanceof Error ? error.message : "Unknown error"}.`,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return {
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
		availableModels: AVAILABLE_MODELS,
	};
};

export { useWebLLM };

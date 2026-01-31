import { CreateMLCEngine, type MLCEngineInterface } from "@mlc-ai/web-llm";
import { useCallback, useState } from "react";

const SELECTED_MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

interface Message {
	role: "system" | "user" | "assistant";
	content: string;
}

function useWebLLM() {
	const [engine, setEngine] = useState<MLCEngineInterface | null>(null);
	const [progress, setProgress] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "system",
			content:
				"You are a helpful, respectful, and honest assistant named Deep Search. Always answer as helpfully as possible.",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isModelLoading, setIsModelLoading] = useState(false);

	// Initialize the engine
	const initializeEngine = useCallback(async () => {
		if (engine) return;

		setIsModelLoading(true);
		try {
			const newEngine = await CreateMLCEngine(SELECTED_MODEL, {
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
	}, [engine]);

	// Handle message submission
	const handleSubmit = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!input.trim() || !engine || isLoading) return;

		const userMessage: Message = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
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
		} catch (error) {
			console.error("Chat error:", error);
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: "Sorry, something went wrong." },
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
	};
}

export { useWebLLM };

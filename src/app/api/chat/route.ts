import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";

interface Message {
	role: "system" | "user" | "assistant";
	content: string;
}

export async function POST(req: NextRequest) {
	try {
		const { messages, model }: { messages: Message[]; model: string } =
			await req.json();
		const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{ error: "Gemini API Key is not configured in .env.local" },
				{ status: 500 },
			);
		}

		const genAI = new GoogleGenerativeAI(apiKey);

		// Map UI model IDs to actual Gemini model IDs if necessary
		// Using standard model names that are widely supported
		let geminiModelId = model;
		if (model === "gemini-flash-lite-latest") {
			geminiModelId = "gemini-1.5-flash"; // More stable ID than -latest
		} else if (model.startsWith("gemini-3")) {
			// If Gemini 3 is requested but failing, it might need the version or be in preview
			// Mapping to common stable IDs as fallbacks
			geminiModelId =
				model === "gemini-3-pro-preview"
					? "gemini-1.5-pro"
					: "gemini-1.5-flash";
		} else if (model.includes("2.5")) {
			geminiModelId = model.includes("pro")
				? "gemini-1.5-pro"
				: "gemini-1.5-flash";
		}

		// Extract system message and chat history
		const systemMessage = messages.find((m) => m.role === "system")?.content;
		const chatMessages = messages.filter((m) => m.role !== "system");

		const genModel = genAI.getGenerativeModel({
			model: geminiModelId,
			systemInstruction: systemMessage,
		});

		// Prepare history and current message
		const history = chatMessages.slice(0, -1).map((m) => ({
			role: m.role === "assistant" ? "model" : ("user" as const),
			parts: [{ text: m.content }],
		}));
		const lastMessage = chatMessages[chatMessages.length - 1].content;

		const chat = genModel.startChat({
			history: history,
		});

		const result = await chat.sendMessageStream(lastMessage);

		const stream = new ReadableStream({
			async start(controller) {
				for await (const chunk of result.stream) {
					const chunkText = chunk.text();
					controller.enqueue(new TextEncoder().encode(chunkText));
				}
				controller.close();
			},
		});

		return new NextResponse(stream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Transfer-Encoding": "chunked",
			},
		});
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to generate response";
		console.error("Gemini API Error:", error);
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}

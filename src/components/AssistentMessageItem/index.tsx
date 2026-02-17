import { Brain, CircleStop, Copy, Sparkles, Volume2 } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useSpeech } from "react-text-to-speech";
import remarkGfm from "remark-gfm";

import { Button } from "../ui/button";

interface IProps {
	role: string;
	content: string;
	isLoading: boolean;
}

const AssistentMessageItem: React.FC<IProps> = ({
	role,
	content,
	isLoading,
}) => {
	const { speechStatus, start, stop } = useSpeech({
		text: content,
		stableText: true,
		highlightText: true,
	});

	if (role === "system") {
		return (
			<div className="flex w-full justify-center my-10 md:my-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
				<div className="relative max-w-[95%] md:max-w-[85%] px-10 py-8 text-center group">
					{/* Animated Mesh Gradients */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />

					<div className="relative bg-background/60 border border-primary/20 backdrop-blur-2xl rounded-[2.5rem] px-10 py-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-700 group-hover:border-primary/50 group-hover:shadow-primary/10">
						{/* Glossy Overlay */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

						<div className="flex justify-center mb-4">
							<div className="relative p-3 rounded-2xl bg-primary/10 text-primary">
								<Sparkles className="h-5 w-5 animate-pulse" />
								<div className="absolute -inset-1 bg-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>
						</div>

						<div className="text-sm md:text-lg text-foreground font-medium tracking-tight leading-relaxed max-w-2xl mx-auto">
							{content.split("—").map((part, i) => (
								<React.Fragment key={`${part.substring(0, 10)}-${i}`}>
									{i > 0 && (
										<span className="block h-px w-12 mx-auto my-4 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
									)}
									<span
										className={
											i === 0
												? "text-foreground font-bold tracking-tighter"
												: "text-muted-foreground/80 font-normal italic"
										}
									>
										{part}
									</span>
								</React.Fragment>
							))}
						</div>

						<div className="mt-6 flex justify-center items-center gap-2">
							<div className="h-1 w-1 rounded-full bg-primary/50" />
							<div className="h-1.5 w-1.5 rounded-full bg-primary" />
							<div className="h-1 w-1 rounded-full bg-primary/50" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`flex w-full px-2 md:px-0 ${
				role === "user" ? "justify-end" : "justify-start"
			} animate-in fade-in slide-in-from-bottom-2 duration-500`}
		>
			<div
				className={`relative max-w-[85%] md:max-w-[75%] ${
					role === "user"
						? "px-5 py-3.5 bg-gradient-to-br from-primary to-blue-700 dark:from-primary dark:to-blue-600 text-primary-foreground rounded-[1.5rem] rounded-tr-[0.3rem] shadow-xl shadow-primary/10"
						: "text-foreground leading-relaxed text-[1rem] pr-6"
				}`}
			>
				{role === "assistant" && (
					<div className="flex items-center gap-2.5 mb-3">
						<div className="bg-primary h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-white/20">
							DS
						</div>
						<span className="text-xs font-bold tracking-wider uppercase text-muted-foreground/70">
							Deep Search
						</span>
					</div>
				)}

				<div
					className={`prose prose-zinc dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted/30 prose-pre:border-border/30 prose-pre:rounded-2xl max-w-none ${role === "user" ? "prose-p:m-0 prose-invert font-medium" : ""}`}
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
									<div className="rounded-2xl border border-border/40 bg-muted/40 p-4 my-5 overflow-x-auto shadow-inner">
										<code
											className={`${className} text-sm font-mono text-foreground`}
											{...props}
										>
											{children}
										</code>
									</div>
								) : (
									<code
										className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-sm font-mono"
										{...props}
									>
										{children}
									</code>
								);
							},
							// @ts-expect-error
							think: ({ children }) => (
								<div className="bg-muted/20 border-l-4 border-primary/40 px-5 py-4 my-6 text-muted-foreground italic text-[0.95rem] rounded-r-2xl relative overflow-hidden group shadow-sm">
									<div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
									<div className="flex items-center gap-2.5 mb-2.5 not-italic font-black text-[10px] uppercase tracking-[0.2em] text-primary/60">
										<Brain className="h-3.5 w-3.5 animate-pulse" />
										Neural Reasoning
									</div>
									<div className="relative z-10 leading-relaxed">
										{children}
									</div>
								</div>
							),
						}}
					>
						{content}
					</ReactMarkdown>
				</div>

				{/* Action Bar for Assistant */}
				{role === "assistant" && !isLoading && (
					<div className="flex items-center gap-2 text-muted-foreground mt-5 animate-in fade-in slide-in-from-top-1 duration-500">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 cursor-pointer"
							onClick={() => {
								navigator.clipboard.writeText(content);
							}}
						>
							<Copy className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 cursor-pointer"
							onClick={() => (speechStatus === "started" ? stop() : start())}
						>
							{speechStatus === "started" ? (
								<CircleStop className="h-4 w-4" />
							) : (
								<Volume2 className="h-4 w-4" />
							)}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AssistentMessageItem;

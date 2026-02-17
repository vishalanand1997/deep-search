"use client";

import {
	Check,
	ChevronDown,
	Cloud,
	Cpu,
	Loader2,
	Mic,
	Plus,
	Send,
} from "lucide-react";
import type React from "react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Model {
	id: string;
	name: string;
	type: string;
	description?: string;
}

interface ChatInputProps {
	input: string;
	setInput: (value: string) => void;
	isLoading: boolean;
	onSubmit: () => void;
	onKeyDown: (e: React.KeyboardEvent) => void;
	onStartListening: () => void;
	selectedModel: string;
	onSelectModel: (modelId: string) => void;
	availableModels: Model[];
}

const ChatInput: React.FC<ChatInputProps> = ({
	input,
	setInput,
	isLoading,
	onSubmit,
	onKeyDown,
	onStartListening,
	selectedModel,
	onSelectModel,
	availableModels,
}) => {
	const currentModel = availableModels.find((m) => m.id === selectedModel);
	return (
		<div className="p-4 pt-2 md:px-0 pb-8 w-full max-w-3xl mx-auto bg-transparent relative z-20">
			{/* Decorative Glow */}
			<div className="absolute -top-12 inset-x-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

			<div className="relative rounded-[2rem] bg-background/60 dark:bg-zinc-900/60 backdrop-blur-3xl border border-white/20 dark:border-white/5 p-2 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] focus-within:ring-2 focus-within:ring-primary/30 transition-all duration-500 hover:border-primary/20 group">
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={onKeyDown}
					placeholder="Message Deep Search..."
					className="min-h-[60px] w-full px-4 py-3 text-foreground bg-transparent outline-none resize-none placeholder:text-muted-foreground/60 font-medium text-[0.95rem] leading-relaxed"
					rows={1}
				/>

				<div className="flex items-center justify-between mt-1 px-2 pb-1">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="h-9 w-9 rounded-2xl text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300"
						>
							<Plus className="h-5 w-5" />
						</Button>
					</div>

					<div className="flex items-center gap-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="flex items-center px-4 py-1.5 rounded-xl text-[11px] font-bold tracking-[0.05em] uppercase text-muted-foreground outline-none hover:text-primary hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/10"
								>
									{currentModel?.name || "Select Model"}{" "}
									<ChevronDown className="ml-2 h-3 w-3 opacity-50" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-80 bg-background/90 backdrop-blur-2xl border-white/10 dark:border-white/5 rounded-[1.5rem] p-2.5 shadow-[0_20px_80px_rgba(0,0,0,0.3)] mb-4 animate-in slide-in-from-bottom-2 duration-300"
							>
								<DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 px-3 py-3">
									Cognitive Engines
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="bg-primary/5 mx-2" />
								<div className="max-h-[350px] overflow-auto py-2 space-y-1.5">
									{availableModels.map((model) => (
										<DropdownMenuItem
											key={model.id}
											onClick={() => onSelectModel(model.id)}
											className={`flex flex-col items-start gap-1 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
												selectedModel === model.id
													? "bg-primary/10 text-primary ring-1 ring-primary/20"
													: "hover:bg-primary/5 text-muted-foreground hover:text-foreground"
											}`}
										>
											<div className="flex items-center justify-between w-full">
												<div className="flex items-center gap-2.5">
													<div
														className={`p-1.5 rounded-lg ${selectedModel === model.id ? "bg-primary/20" : "bg-muted"}`}
													>
														{model.type === "cloud" ? (
															<Cloud className="h-3.5 w-3.5" />
														) : (
															<Cpu className="h-3.5 w-3.5" />
														)}
													</div>
													<span className="font-bold text-[0.9rem] tracking-tight">
														{model.name}
													</span>
												</div>
												{selectedModel === model.id && (
													<Check className="h-4 w-4 text-primary animate-in zoom-in duration-300" />
												)}
											</div>
											{model.description && (
												<p className="text-[11px] leading-relaxed opacity-70 font-medium pl-8">
													{model.description}
												</p>
											)}
										</DropdownMenuItem>
									))}
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						{input.trim() ? (
							<Button
								onClick={onSubmit}
								disabled={isLoading}
								size="icon"
								className="h-10 w-10 rounded-2xl bg-primary hover:bg-blue-600 text-primary-foreground shadow-[0_8px_20px_rgba(65,105,225,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 group/send"
							>
								{isLoading ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<Send className="h-5 w-5 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5 transition-transform" />
								)}
							</Button>
						) : (
							<Button
								size="icon"
								className="h-10 w-10 rounded-2xl bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 shadow-sm"
								onClick={onStartListening}
							>
								<Mic className="h-5 w-5" />
							</Button>
						)}
					</div>
				</div>
			</div>
			<div className="mt-4 text-center text-[10px] text-muted-foreground/50 font-bold uppercase tracking-[0.2em] animate-in fade-in duration-1000">
				Powered by Deep Search
			</div>
		</div>
	);
};

export default ChatInput;

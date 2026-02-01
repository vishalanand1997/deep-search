import { CircleStop, Copy, Volume2 } from "lucide-react";
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

	return (
		<div
			className={`flex w-full ${
				role === "user" ? "justify-end" : "justify-start"
			}`}
		>
			<div
				className={`relative max-w-[85%] ${
					role === "user"
						? "px-4 py-2.5 bg-card border border-border/20 text-card-foreground rounded-2xl rounded-tr-sm"
						: "text-foreground leading-relaxed text-[0.95rem] pr-4"
				}`}
			>
				{role === "assistant" && (
					<div className="flex items-center gap-2 mb-2">
						<div
							className={`bg-primary h-5 w-5 rounded-[4px] flex items-center justify-center text-[9px] font-bold text-primary-foreground shadow-sm ring-1 ring-border/50
														}`}
						>
							DS
						</div>
						<span className="text-xs font-semibold text-muted-foreground">
							Deep Search
						</span>
					</div>
				)}

				<div
					className={`prose dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-xl max-w-none ${role === "user" ? "prose-p:m-0" : ""}`}
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
									<div className="rounded-md border border-border bg-muted/50 p-3 my-4 overflow-x-auto">
										<code
											className={`${className} text-sm font-mono text-foreground`}
											{...props}
										>
											{children}
										</code>
									</div>
								) : (
									<code
										className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-primary"
										{...props}
									>
										{children}
									</code>
								);
							},
						}}
					>
						{content}
					</ReactMarkdown>
				</div>

				{/* Action Bar for Assistant */}
				{role === "assistant" && !isLoading && (
					<div className="flex items-center gap-1 text-zinc-500 mt-4 animate-in fade-in duration-300">
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
							onClick={() => {
								navigator.clipboard.writeText(content);
							}}
						>
							<Copy className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
							onClick={() => (speechStatus === "started" ? stop() : start())}
						>
							{speechStatus === "started" ? (
								<CircleStop className="h-3.5 w-3.5" />
							) : (
								<Volume2 className="h-3.5 w-3.5" />
							)}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default AssistentMessageItem;

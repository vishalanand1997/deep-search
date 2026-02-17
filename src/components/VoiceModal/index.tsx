"use client";

import { Mic, X } from "lucide-react";
import type React from "react";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface VoiceModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	transcript: string;
	onStopListening: () => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({
	isOpen,
	onOpenChange,
	transcript,
	onStopListening,
}) => {
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent className="w-[400px] h-[220px] bg-popover border-border rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
				<div className="flex items-center justify-between w-full mb-4">
					<AlertDialogTitle asChild>
						<h2 className="text-foreground font-semibold tracking-tight text-xl">
							Listening...
						</h2>
					</AlertDialogTitle>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
						onClick={onStopListening}
					>
						<X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
					</Button>
				</div>
				<AlertDialogDescription asChild>
					<div className="flex flex-col items-center justify-center py-6">
						<div className="relative">
							<div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
							<div className="relative bg-blue-600 p-5 rounded-full shadow-2xl shadow-blue-500/40 ring-4 ring-blue-500/20">
								<Mic className="h-10 w-10 text-white" />
							</div>
						</div>
					</div>
				</AlertDialogDescription>
				{transcript && (
					<div className="mt-4 text-center text-foreground/80 text-sm font-medium line-clamp-2 italic px-2">
						"{transcript}"
					</div>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default VoiceModal;

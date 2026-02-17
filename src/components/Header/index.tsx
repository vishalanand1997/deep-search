"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type React from "react";

import { Button } from "../ui/button";

const Header: React.FC = () => {
	const { setTheme, theme } = useTheme();

	return (
		<header className="flex h-14 items-center justify-between px-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					className="flex items-center gap-2 font-semibold text-foreground hover:bg-muted/50 px-2"
				>
					<div className="bg-blue-600 h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-white/10">
						DS
					</div>
					Deep Search
				</Button>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					className="text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer rounded-xl h-9 w-9"
				>
					<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</div>
		</header>
	);
};

export default Header;

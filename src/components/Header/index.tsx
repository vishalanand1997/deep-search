"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";

const Header: React.FC = () => {
	const { setTheme, theme } = useTheme();
	return (
		<header className="flex h-14 items-center justify-between px-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
			<div className="flex items-center gap-2 relative">
				<Button
					variant="ghost"
					className="flex items-center gap-2 font-semibold text-foreground hover:bg-muted/50 px-2"
				>
					Deep Search
					<div className="bg-primary h-5 w-5 rounded-[4px] flex items-center justify-center text-[9px] font-bold text-primary-foreground shadow-sm ring-1 ring-border/50">
						DS
					</div>
				</Button>
			</div>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className="text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
			>
				<Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		</header>
	);
};

export default Header;

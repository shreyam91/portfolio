"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Hydration safety: useTheme can return undefined on the server
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="w-[104px] h-9 bg-muted rounded-full animate-pulse"></div>
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 border border-border rounded-full shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "light" 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "dark" 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-full transition-all ${
          theme === "system" 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
        title="System Preference"
      >
        <Monitor size={16} />
      </button>
    </div>
  )
}


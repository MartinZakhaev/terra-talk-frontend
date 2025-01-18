"use client";

import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { NewConversationDialog } from "../dialogs/newConversationDialog";
import { Particles } from "../background/particle";
import { useTheme } from "next-themes";
import { ShimmerButton } from "../ui/shimmer-button";

interface WelcomeScreenProps {
    userId: string;
}

export function WelcomeScreen({ userId }: WelcomeScreenProps) {
    const { theme } = useTheme()
    const [color, setColor] = useState("#ffffff")

    useEffect(() => {
        setColor(theme === "dark" ? "#ffffff" : "#000000")
    }, [theme])
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <div className="relative flex flex-col items-center justify-center h-full text-center p-8">
                <h2 className="text-6xl font-semibold mb-2 pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center leading-none text-transparent dark:from-white dark:to-slate-900/10">Welcome to Terra Talk!</h2>
                <p className="text-muted-foreground mb-4">
                    Select a conversation from the sidebar or start a new one to begin chatting
                </p>
                <div className="flex gap-2">
                    <ShimmerButton className="shadow-2xl" onClick={() => setIsDialogOpen(true)}>
                        <MessageSquarePlus className="mr-2 h-4 w-4 dark:text-white" />
                        <span className="whitespace-pre-wrap text-center text-sm font-light leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            New Conversation
                        </span>
                    </ShimmerButton>
                </div>
                <Particles
                    className="absolute inset-0"
                    quantity={100}
                    ease={80}
                    color={color}
                    refresh
                />
            </div>

            <NewConversationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                userId={userId}
            />
        </>
    );
}
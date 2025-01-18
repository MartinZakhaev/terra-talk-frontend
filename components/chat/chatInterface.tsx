"use client";

import { ChatBubble } from "./chatBubble";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Paperclip, Send } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "../ui/breadcrumb";
import { ModeToggle } from "../ui/mode-toggle";
import { useMessageStore } from "@/stores/useMessageStore";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface ChatInterfaceProps {
    conversationId: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
    const { messages, fetchMessages, sendMessage, initializeSocket, disconnectSocket } = useMessageStore();
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        getUser();

        // Initialize socket connection
        initializeSocket();

        // Cleanup socket on unmount
        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId);
        }
    }, [conversationId, fetchMessages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !userId) return;

        await sendMessage(conversationId, userId, newMessage);
        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (
        <>
            <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Conversations</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <ModeToggle className="ml-auto" />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex-1 flex-col overflow-y-auto max-h-[calc(100vh-10rem)]">
                    {messages.map((message) => (
                        <ChatBubble
                            key={message.id}
                            avatar={message.sender.avatar || "https://via.placeholder.com/40"}
                            username={message.sender.username}
                            timestamp={new Date(message.createdAt).toLocaleString()}
                            message={message.content}
                            isSender={message.senderId === userId}
                        />
                    ))}
                </div>
                <div className="sticky bottom-0 flex flex-row items-center gap-4 bg-background p-0">
                    <Button>
                        <Paperclip />
                    </Button>
                    <div className="flex flex-1">
                        <Input
                            placeholder="Type a message"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyPress} />
                    </div>
                    <Button onClick={handleSendMessage}>
                        <Send />
                    </Button>
                </div>
            </div>
        </>
    );
}
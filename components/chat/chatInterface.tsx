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
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

interface ChatInterfaceProps {
    conversationId: string;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
    const { messages, fetchMessages, sendMessage, initializeSocket, disconnectSocket, hasMore, isLoading } = useMessageStore();
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container || isLoading || !hasMore) return;

        if (container.scrollTop === 0) {
            setPrevScrollHeight(container.scrollHeight);
            setPage(prev => prev + 1);
            fetchMessages(conversationId, page + 1);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
            }
        };
        getUser();
        initializeSocket();

        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (conversationId) {
            fetchMessages(conversationId);
        }
    }, [conversationId]);

    useEffect(() => {
        if (page === 1 && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (page > 1 && containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeight;
            containerRef.current.scrollTop = scrollDiff;
        }
    }, [messages, page]);

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
                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="flex-1 flex-col overflow-y-auto max-h-[calc(100vh-10rem)]"
                >
                    {isLoading && hasMore && (
                        <div className="flex justify-center p-4">
                            <span>Loading messages...</span>
                        </div>
                    )}
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
                    <div ref={messagesEndRef} />
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
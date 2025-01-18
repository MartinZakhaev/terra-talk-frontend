import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/chat/chatInterface";
import { SidebarInset } from "@/components/ui/sidebar";

interface ConversationPageProps {
    params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({
    params,
}: ConversationPageProps) {
    const { conversationId } = await params;

    return (
        <SidebarInset>
            <ChatInterface
                conversationId={conversationId}
            />
        </SidebarInset>
    );
}
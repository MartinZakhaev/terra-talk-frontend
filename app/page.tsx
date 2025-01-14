import { ChatBubble } from "@/components/chat/chatBubble";
import { AppSidebar } from "@/components/navigations/appSidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Paperclip, Send } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/sign-in");
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        user={{
          name: data.user.user_metadata.username || "",
          email: data.user.email || "",
          avatar: data.user.user_metadata.avatar || "",
        }}
      />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <ModeToggle className="ml-auto" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex-1 flex-col overflow-y-auto max-h-[calc(100vh-10rem)]">
            {Array.from({ length: 24 }).map((_, index) => (
              <ChatBubble
                key={index}
                avatar="https://via.placeholder.com/40"
                username={`User ${index + 1}`}
                timestamp="Just now"
                message="This is a mock message."
              />
            ))}
          </div>
          <div className="sticky bottom-0 flex flex-row items-center gap-4 bg-background p-0">
            <Button>
              <Paperclip />
            </Button>
            <div className="flex flex-1">
              <Input placeholder="Type a message" />
            </div>
            <Button>
              <Send />
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

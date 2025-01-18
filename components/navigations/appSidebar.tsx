"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArchiveX, Command, File, Inbox, Send, Trash2, MessageSquarePlus } from "lucide-react";

import { NavUser } from "@/components/navigations/navUser";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { timeAgo } from "@/utils/timeAgo";
import Link from "next/link";
import { useConversationStore } from "@/stores/useConversationStore";
import { NewConversationDialog } from "../dialogs/newConversationDialog";
import Lottie from "lottie-react";
import emptyAnimation from "@/public/animations/pageNotFound.json";
import { useTheme } from "next-themes";
import { useVirtualizer } from "@tanstack/react-virtual";

interface AppSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

const data = {
  navMain: [
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Drafts",
      url: "#",
      icon: File,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: Send,
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
    {
      title: "New Conversation",
      url: "#",
      icon: MessageSquarePlus,
      isActive: false,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeItem, setActiveItem] = useState(data.navMain[0]);
  const { conversations, fetchConversations } = useConversationStore();
  const { setOpen } = useSidebar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const { hasMore, isLoading, currentPage } = useConversationStore();

  const rowVirtualizer = useVirtualizer({
    count: conversations.length + (hasMore ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimate height of each conversation item
    overscan: 5,
  });

  useEffect(() => {
    const lastItem = rowVirtualizer.getVirtualItems().at(-1);
    if (!lastItem || !hasMore || isLoading) return;

    const isLastItemVisible = lastItem.index === conversations.length;
    if (isLastItemVisible) {
      fetchConversations(user.id, currentPage + 1);
    }
  }, [rowVirtualizer.getVirtualItems()]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    if (user?.id) {
      fetchConversations(user.id);
    }

    return () => {
      controller.abort();
    };
  }, [user?.id]);

  const lottieStyle = mounted ? {
    filter: theme === "dark" ? "invert(1)" : "none",
    opacity: theme === "dark" ? 0.8 : 1
  } : {};

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        if (item.title === "New Conversation") {
                          setIsDialogOpen(true);
                          return;
                        }
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {Array.isArray(conversations) && conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-60 h-60 mb-4">
                    <Lottie
                      animationData={emptyAnimation}
                      loop={true}
                      autoplay={true}
                      style={lottieStyle}
                    />
                  </div>
                  <h3 className="font-medium mb-1">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start chatting by creating a new conversation
                  </p>
                </div>
              ) : (
                <div ref={parentRef} className="h-full overflow-auto">
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const conversation = conversations[virtualRow.index];
                      const isLoaderRow = virtualRow.index === conversations.length;

                      return (
                        <div
                          key={virtualRow.index}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          {isLoaderRow ? (
                            hasMore ? (
                              <div className="flex justify-center items-center h-full">
                                <span>Loading more...</span>
                              </div>
                            ) : null
                          ) : (
                            <Link
                              href={`/conversations/${conversation.id}`}
                              className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                              <div className="flex w-full items-center gap-2">
                                <span>{conversation.participants[conversation.participants[1].userId === user.id ? 0 : 1].user.username}</span>{" "}
                                <span className="ml-auto text-xs">{timeAgo(conversation.createdAt)}</span>
                              </div>
                              <span className="font-medium">{conversation.participants[conversation.participants[1].userId === user.id ? 0 : 1].user.firstName}</span>
                              <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                                {conversation.messages[0]
                                  ? `${conversation.messages[0].sender.firstName}: ${conversation.messages[0].content}`
                                  : "This is the beginning of ur conversation"}
                              </span>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <NewConversationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userId={user.id}
      />
    </Sidebar>
  );
}

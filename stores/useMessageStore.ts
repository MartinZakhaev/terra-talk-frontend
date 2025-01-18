import { createStore } from "zustand/vanilla";
import axios from "axios";
import { toastError } from "@/utils/toast";
import { io, Socket } from "socket.io-client";
import { useStore } from "zustand";
import { conversationStore } from "./useConversationStore";
import { Message } from "@/types/chat";

// interface Message {
//   id: string;
//   content: string;
//   createdAt: string;
//   senderId: string;
//   conversationId: string;
//   sender: {
//     firstName: string;
//     lastName: string;
//     username: string;
//     avatar?: string;
//   };
// }

interface MessageStore {
  messages: Message[];
  isLoading: boolean;
  socket: Socket | null;
  initializeSocket: () => void;
  disconnectSocket: () => void;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    senderId: string,
    content: string
  ) => Promise<void>;
  addMessage: (message: Message) => void;
  reset: () => void;
}

export const messageStore = createStore<MessageStore>((set, get) => ({
  messages: [],
  isLoading: false,
  socket: null,

  initializeSocket: () => {
    const socket = io("http://localhost:7777");

    socket.on("new_message", (message: Message) => {
      const state = get();
      if (message.conversationId === state.messages[0]?.conversationId) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
        conversationStore
          .getState()
          .updateConversationLastMessage(message.conversationId, message);
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchMessages: async (conversationId: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `http://localhost:7777/api/conversations/${conversationId}/messages`
      );
      set({ messages: response.data });
    } catch (error) {
      toastError("Failed to fetch messages");
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (
    conversationId: string,
    senderId: string,
    content: string
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:7777/api/conversations/${conversationId}/messages`,
        {
          senderId,
          content,
        }
      );

      const { socket } = get();
      if (socket) {
        socket.emit("send_message", response.data);
      }

      set((state) => ({
        messages: [...state.messages, response.data],
      }));
      conversationStore
        .getState()
        .updateConversationLastMessage(conversationId, response.data);
    } catch (error) {
      toastError("Failed to send message");
    }
  },

  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  reset: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      messages: [],
      isLoading: false,
      socket: null,
    });
  },
}));

export const useMessageStore = () => useStore(messageStore);

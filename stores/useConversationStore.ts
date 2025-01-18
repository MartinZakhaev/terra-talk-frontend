import { createStore } from "zustand/vanilla";
import axios from "axios";
import { toastError } from "@/utils/toast";

// interface Conversation {
//   id: string;
//   name?: string;
//   createdAt: string;
//   participants: {
//     id: string;
//     userId: string;
//     user: {
//       firstName: string;
//       lastName: string;
//       username: string;
//       avatar?: string;
//     };
//   }[];
//   messages: {
//     id: string;
//     content: string;
//     createdAt: string;
//     sender: {
//       firstName: string;
//       lastName: string;
//       username: string;
//     };
//   }[];
// }

interface ConversationStore {
  conversations: Conversation[];
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  fetchConversations: (userId: string, page?: number) => Promise<void>;
  addConversation: (conversation: Conversation) => void;
  updateConversationLastMessage: (
    conversationId: string,
    message: Message
  ) => void;
  reset: () => void;
}

export const conversationStore = createStore<ConversationStore>((set, get) => ({
  conversations: [],
  isLoading: false,
  hasMore: true,
  currentPage: 1,

  fetchConversations: async (userId: string, page = 1) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `http://localhost:7777/api/users/${userId}/conversations?page=${page}&limit=20`
      );

      set((state) => ({
        conversations:
          page === 1
            ? response.data.conversations
            : [...state.conversations, ...response.data.conversations],
        hasMore: response.data.hasMore,
        currentPage: page,
        isLoading: false,
      }));
    } catch (error) {
      toastError("Failed to fetch conversations");
      set({ isLoading: false });
    }
  },
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),
  reset: () => {
    set({
      conversations: [],
      isLoading: false,
    });
  },
  updateConversationLastMessage: (conversationId: string, message: Message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [message, ...conv.messages],
            }
          : conv
      ),
    })),
}));

// Create a hook for React components
import { useStore } from "zustand";
import { Conversation, Message } from "@/types/chat";

export const useConversationStore = () => useStore(conversationStore);

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
  fetchConversations: (userId: string) => Promise<void>;
  addConversation: (conversation: Conversation) => void;
  updateConversationLastMessage: (
    conversationId: string,
    message: Message
  ) => void;
  reset: () => void;
}

export const conversationStore = createStore<ConversationStore>((set) => ({
  conversations: [] as Conversation[],
  isLoading: false,
  fetchConversations: async (userId: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `http://localhost:7777/api/users/${userId}/conversations`
      );
      set({ conversations: response.data });
    } catch (error) {
      toastError("Failed to fetch conversations");
    } finally {
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

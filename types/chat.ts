export interface Message {
  id: string;
  content: string;
  createdAt: string;
  conversationId: string;
  senderId: string;
  sender: {
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  name?: string;
  createdAt: string;
  participants: {
    id: string;
    userId: string;
    user: {
      firstName: string;
      lastName: string;
      username: string;
      avatar?: string;
    };
  }[];
  messages: Message[];
}

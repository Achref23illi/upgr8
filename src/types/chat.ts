export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'coach' | 'player';
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
}

export interface Conversation {
  id: string;
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  type: 'coach' | 'player';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  currentConversation?: string;
  isLoading: boolean;
}

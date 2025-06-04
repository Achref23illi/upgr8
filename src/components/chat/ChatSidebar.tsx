"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Search, 
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  CheckCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Conversation, Message, Participant } from "@/types/chat";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    type: 'coach' | 'player';
  };
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [
      { id: "coach-1", name: "Coach Martin", type: "coach", isOnline: true },
      { id: "player-1", name: "Alexandre Dubois", type: "player", isOnline: false, lastSeen: "2025-01-20T10:30:00Z" }
    ],
    lastMessage: {
      id: "msg-1",
      senderId: "coach-1",
      senderName: "Coach Martin",
      senderType: "coach",
      receiverId: "player-1",
      content: "Excellent travail à l'entraînement aujourd'hui! Continue comme ça.",
      timestamp: "2025-01-20T15:30:00Z",
      isRead: true
    },
    unreadCount: 0,
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-20T15:30:00Z"
  },
  {
    id: "conv-2",
    participants: [
      { id: "coach-1", name: "Coach Martin", type: "coach", isOnline: true },
      { id: "player-2", name: "Emma Gagnon", type: "player", isOnline: true }
    ],
    lastMessage: {
      id: "msg-2",
      senderId: "player-2",
      senderName: "Emma Gagnon",
      senderType: "player",
      receiverId: "coach-1",
      content: "Coach, j'ai une question sur la technique de lancer que vous m'avez montrée",
      timestamp: "2025-01-20T14:15:00Z",
      isRead: false
    },
    unreadCount: 2,
    createdAt: "2025-01-18T11:00:00Z",
    updatedAt: "2025-01-20T14:15:00Z"
  }
];

const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      senderId: "player-1",
      senderName: "Alexandre Dubois",
      senderType: "player",
      receiverId: "coach-1",
      content: "Bonjour Coach, merci pour les conseils d'hier!",
      timestamp: "2025-01-20T14:00:00Z",
      isRead: true
    },
    {
      id: "msg-1-2",
      senderId: "coach-1",
      senderName: "Coach Martin",
      senderType: "coach",
      receiverId: "player-1",
      content: "Excellent travail à l'entraînement aujourd'hui! Continue comme ça.",
      timestamp: "2025-01-20T15:30:00Z",
      isRead: true
    }
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      senderId: "player-2",
      senderName: "Emma Gagnon",
      senderType: "player",
      receiverId: "coach-1",
      content: "Coach, j'ai une question sur la technique de lancer que vous m'avez montrée",
      timestamp: "2025-01-20T14:15:00Z",
      isRead: false
    }
  ]
};

export function ChatSidebar({ isOpen, onClose, currentUser }: ChatSidebarProps) {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv => 
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.id !== currentUser.id
    )
  );

  const currentConversation = selectedConversation ? 
    conversations.find(c => c.id === selectedConversation) : null;

  const currentMessages = selectedConversation ? 
    messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderType: currentUser.type,
      receiverId: currentConversation?.participants.find(p => p.id !== currentUser.id)?.id || "",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message]
    }));

    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatTime(timestamp);
    } else {
      return messageTime.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getOtherParticipant = (conversation: Conversation): Participant => {
    return conversation.participants.find(p => p.id !== currentUser.id) || conversation.participants[0];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Messages
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {!selectedConversation ? (
            <>
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation);
                  
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-red-100 text-red-700 text-sm">
                              {otherParticipant.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {otherParticipant.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {otherParticipant.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {conversation.lastMessage && (
                                <span className="text-xs text-gray-500">
                                  {formatLastMessageTime(conversation.lastMessage.timestamp)}
                                </span>
                              )}
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-4 rounded-full flex items-center justify-center">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {conversation.lastMessage && (
                            <p className="text-xs text-gray-600 truncate mt-1">
                              {conversation.lastMessage.senderType === currentUser.type ? "Vous: " : ""}
                              {conversation.lastMessage.content}
                            </p>
                          )}
                          
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              {otherParticipant.type === 'coach' ? 'Coach' : 'Joueur'}
                            </Badge>
                            {!otherParticipant.isOnline && otherParticipant.lastSeen && (
                              <span className="text-xs text-gray-400 ml-2">
                                Vu {formatLastMessageTime(otherParticipant.lastSeen)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">Aucune conversation trouvée</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedConversation(null)}
                      className="p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-red-100 text-red-700 text-xs">
                          {getOtherParticipant(currentConversation!).name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {getOtherParticipant(currentConversation!).isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {getOtherParticipant(currentConversation!).name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getOtherParticipant(currentConversation!).isOnline ? "En ligne" : "Hors ligne"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="p-2">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentMessages.map((message) => {
                  const isOwnMessage = message.senderId === currentUser.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        isOwnMessage 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 ${
                          isOwnMessage ? 'text-red-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          {isOwnMessage && (
                            <div className="ml-2">
                              {message.isRead ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="p-2">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="text-sm"
                    />
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-red-600 hover:bg-red-700 p-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

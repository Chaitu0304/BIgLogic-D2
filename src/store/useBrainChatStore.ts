import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  assistantMessageId?: string;
  rating?: 'up' | 'down';
  feedbackText?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

interface BrainChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, updater: (msg: Message) => Message) => void;
  createConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  setConversations: (conversations: Conversation[]) => void;
  replaceId: (oldId: string, newId: string) => void;
  upsertConversation: (conversationId: string, title: string, messages: Message[], updatedAt?: number) => void;
  deleteMessagesFrom: (conversationId: string, messageId: string) => void;
  clearAll: () => void;
}

export const useBrainChatStore = create<BrainChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) =>
    set((state) => {
      const convs = [...state.conversations];
      let idx = convs.findIndex((c) => c.id === conversationId);
      
      if (idx < 0) {
        // Create the conversation on first message
        const newConv: Conversation = {
          id: conversationId,
          title: 'New Chat',
          messages: [],
          updatedAt: Date.now(),
        };
        convs.unshift(newConv);
        idx = 0;
      }

      if (idx >= 0) {
        convs[idx] = {
          ...convs[idx],
          messages: [...convs[idx].messages, message],
          updatedAt: Date.now(),
        };
        
        // Auto-generate title if it's the first user message and title is "New Chat"
        if (message.role === 'user' && convs[idx].messages.length === 1 && convs[idx].title === 'New Chat') {
          convs[idx].title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
        }
      }
      convs.sort((a, b) => b.updatedAt - a.updatedAt);
      return { conversations: convs };
    }),

  updateMessage: (conversationId, messageId, updater) =>
    set((state) => {
      const convs = [...state.conversations];
      const idx = convs.findIndex((c) => c.id === conversationId);
      if (idx >= 0) {
        const msgs = [...convs[idx].messages];
        const mIdx = msgs.findIndex((m) => m.id === messageId || (m.assistantMessageId && m.assistantMessageId === messageId));
        if (mIdx >= 0) {
          msgs[mIdx] = updater(msgs[mIdx]);
          convs[idx] = {
            ...convs[idx],
            messages: msgs,
            updatedAt: Date.now(),
          };
        }
      }
      convs.sort((a, b) => b.updatedAt - a.updatedAt);
      return { conversations: convs };
    }),

  createConversation: (title) => {
    const id = Date.now().toString();
    // We no longer add the empty conversation to the list immediately.
    // It will be added in addMessage when the first message is sent.
    set({ activeConversationId: id });
    return id;
  },

  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
    })),

  setConversations: (conversations) => set({ conversations: [...conversations].sort((a, b) => b.updatedAt - a.updatedAt) }),
  
  replaceId: (oldId, newId) => 
    set((state) => {
      const convs = [...state.conversations];
      const idx = convs.findIndex((c) => c.id === oldId);
      if (idx >= 0) {
        convs[idx] = { ...convs[idx], id: newId };
      }
      return { 
        conversations: convs,
        activeConversationId: state.activeConversationId === oldId ? newId : state.activeConversationId
      };
    }),

  upsertConversation: (id, title, messages, updatedAt) =>
    set((state) => {
      const convs = [...state.conversations];
      const idx = convs.findIndex((c) => c.id === id);
      if (idx >= 0) {
        // If we have local messages and the incoming messages are empty, preserve local ones
        const newMessages = (messages && messages.length > 0) ? messages : convs[idx].messages;
        
        convs[idx] = {
          ...convs[idx],
          title: title || convs[idx].title,
          messages: newMessages,
          updatedAt: updatedAt || Date.now(),
        };
      } else {
        convs.unshift({
          id,
          title: title || 'New Chat',
          messages: messages || [],
          updatedAt: updatedAt || Date.now(),
        });
      }
      convs.sort((a, b) => b.updatedAt - a.updatedAt);
      return { conversations: convs };
    }),

  deleteMessagesFrom: (conversationId, messageId) =>
    set((state) => {
      const convs = [...state.conversations];
      const idx = convs.findIndex((c) => c.id === conversationId);
      if (idx >= 0) {
        const msgs = [...convs[idx].messages];
        const mIdx = msgs.findIndex((m) => m.id === messageId || (m.assistantMessageId && m.assistantMessageId === messageId));
        if (mIdx >= 0) {
          // Truncate the array right before the message
          convs[idx] = {
            ...convs[idx],
            messages: msgs.slice(0, mIdx),
            updatedAt: Date.now(),
          };
        }
      }
      return { conversations: convs };
    }),

  clearAll: () => set({ conversations: [], activeConversationId: null }),
}));

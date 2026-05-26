"use client";

import { motion } from "framer-motion";
import { MessageSquare, ChevronRight } from "lucide-react";

export type ConversationPreview = {
  id: string;
  title: string;
  ago: string;
};

type ChatRecentConversationsProps = {
  conversations: ConversationPreview[];
  onSelect: (id: string) => void;
  onClear: () => void;
};

export function ChatRecentConversations({
  conversations,
  onSelect,
  onClear,
}: ChatRecentConversationsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border border-emerald-100/60 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-emerald-600" />
          Recent Conversations
        </h3>
        {conversations.length > 0 && (
          <button
            type="button"
            className="text-xs font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
          >
            View all
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <ul className="space-y-1 mb-4">
        {conversations.length === 0 ? (
          <li className="text-sm text-emerald-600/50 py-4 text-center">
            No conversations yet
          </li>
        ) : (
          conversations.map((conv) => (
            <li key={conv.id}>
              <button
                type="button"
                onClick={() => onSelect(conv.id)}
                className="w-full text-left rounded-xl px-2 py-2.5 hover:bg-emerald-50 transition-colors"
              >
                <p className="text-sm font-medium text-emerald-900 truncate">
                  {conv.title}
                </p>
                <p className="text-xs text-emerald-600/60">{conv.ago}</p>
              </button>
            </li>
          ))
        )}
      </ul>
      {conversations.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="w-full text-xs font-medium text-emerald-600/80 hover:text-rose-600 py-2 rounded-lg border border-emerald-50 hover:border-rose-100 hover:bg-rose-50/50 transition-colors"
        >
          Clear Conversation History
        </button>
      )}
    </motion.section>
  );
}

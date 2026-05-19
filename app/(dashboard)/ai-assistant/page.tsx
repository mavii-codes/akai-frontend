import { AiWelcomeBanner } from "@/components/ai/welcome-banner";
import { ChatInterface } from "@/components/ai/chat-interface";
import { ChatSidebar } from "@/components/ai/chat-sidebar";

export default function AiAssistantPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <AiWelcomeBanner />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatInterface />
        </div>
        <ChatSidebar />
      </div>
    </div>
  );
}

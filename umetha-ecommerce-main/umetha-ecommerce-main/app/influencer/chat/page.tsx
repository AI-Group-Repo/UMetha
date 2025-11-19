import MainLayout from "@/components/main-layout";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";

export default function InfluencerChatPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6 py-10">
        <div>
          <p className="text-sm font-semibold text-primary">Influencer Hub</p>
          <h1 className="text-3xl font-bold">Customer Messages</h1>
          <p className="text-muted-foreground">
            Reply to buyers instantly, share content, and keep deals moving.
          </p>
        </div>
        <ChatWorkspace
          emptyStateHeading="No messages yet"
          emptyStateDescription="Once buyers reach out from your store, their conversations will appear here."
        />
      </div>
    </MainLayout>
  );
}



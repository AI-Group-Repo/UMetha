import MainLayout from "@/components/main-layout";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";

export default function ChatPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6 py-10">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            Chat with influencers in real time.
          </p>
        </div>
        <ChatWorkspace
          initialConversationId={params.id}
          emptyStateHeading="No conversations yet"
          emptyStateDescription="Start a chat from an influencer store to see it here."
        />
      </div>
    </MainLayout>
  );
}



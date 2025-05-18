import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
    ActionFunctionArgs, defer,
    json
} from "@remix-run/node";
import { OpenAIClient } from "@/lib/open-ai-client";
import { Header } from "@/components/header";
import {
    PreviousExampleChatSession,
    loadPreviousChat,
} from "@/components/previous-example-chat-session";
import ChatCommandMenu from "~/components/chat-command-menu";
import { useLoaderData, useActionData } from "@remix-run/react";

type ActionData =
  | { error: string; success?: never; imageUrl?: never; prompt?: never }
  | { error?: never; success: boolean; imageUrl?: string; prompt: string };

export async function loader() {
  return defer({
    previousChat: loadPreviousChat(),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const prompt = formData.get("prompt") as string;

  if (!prompt) {
    return json<ActionData>({ error: "Prompt is required" });
  }

  try {
    // Embellish the prompt with additional context
    const embellishedPrompt = `Your task is to create realistic yet subtle images that look like they were taken on a mobile phone: Here is the image I want you to create: ${prompt}.`;

    const openAiClient = new OpenAIClient();
    const images = await openAiClient.generateImage(embellishedPrompt);

    return json<ActionData>({
      success: true,
      imageUrl: images[0]?.url,
      prompt,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return json<ActionData>({
      error: "Failed to generate image. Please try again.",
    });
  }
}

export default function Page() {
  const { previousChat } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();
  const hasImageResult = actionData && 'imageUrl' in actionData && actionData.imageUrl;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-end p-4 pt-0">
          <div className="w-full max-w-3xl mx-auto">
            <PreviousExampleChatSession previousChatPromise={previousChat} />
            {hasImageResult && (
                <div className="mb-8 flex flex-col items-end">
                <div className="bg-gray-100 p-3 rounded-lg mb-2 max-w-xs">
                  <p className="font-medium text-right">{actionData.prompt}</p>
                </div>
                <div className="aspect-video max-w-xl mx-auto overflow-hidden rounded-lg">
                  <img 
                    src={actionData.imageUrl} 
                    alt={actionData.prompt || "Generated image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <ChatCommandMenu />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

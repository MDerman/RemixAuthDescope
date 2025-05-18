import { Await, useAsyncValue } from "@remix-run/react"
import { Suspense } from "react"

export type PreviousChatData = {
  prompt: string
  imageUrl: string
}

export function loadPreviousChat(): Promise<PreviousChatData> {
  const delay = 3000;
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        prompt: `I want an image with the quote "The art of observing and not absorbing." that is written onto a book.`,
        imageUrl: "/images/private-image-example.jpg",
      });
    }, delay);
  });
}

function ChatContent({ data }: { data: PreviousChatData }) {  
  return (
    <div className="flex flex-col items-end">
      <div className="bg-gray-100 p-3 rounded-lg mb-2 max-w-xs">
        <p className="font-medium text-right">{data.prompt}</p>
      </div>
      <div className="aspect-video max-w-xl mx-auto overflow-hidden rounded-lg">
        <img 
          src={data.imageUrl} 
          alt={data.prompt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

export function PreviousExampleChatSession({ previousChatPromise }: { previousChatPromise: Promise<PreviousChatData> }) {
  return (
    <div className="flex flex-col items-end mb-8 w-full max-w-3xl mx-auto">
      <Suspense fallback={
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-lg text-gray-500">Loading previous example session...</div>
        </div>
      }>
        <Await resolve={previousChatPromise}>
          {(data: PreviousChatData) => <ChatContent data={data} />}
        </Await>
      </Suspense>
    </div>
  )
}

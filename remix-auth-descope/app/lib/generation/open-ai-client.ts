import OpenAI from 'openai';
import { z } from 'zod';
import { MessagePair } from './ai-types';

export class OpenAIClient {
  private client: OpenAI;
  private model: string;

  constructor(model: string = 'gpt-4o') {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = model;
    console.log(`Using OpenAI Client with model: ${this.model}`);
  }

  /**
   * Helper function to convert an OpenAI chat completion stream to a ReadableStream
   */
  private convertToReadableStream(
    stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>
  ): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();
    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk.choices[0]?.delta?.content || ''));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }

  
  // Streaming methods
  async streamText(
    messagePairs: MessagePair[]
  ): Promise<ReadableStream<Uint8Array>> {
    try {
      // Convert message pairs to OpenAI message format
      const messages = messagePairs.flatMap(pair => {
        const result = [];
        if (pair.system) result.push({ role: 'system' as const, content: pair.system });
        if (pair.user) result.push({ role: 'user' as const, content: pair.user });
        if (pair.assistant) result.push({ role: 'assistant' as const, content: pair.assistant });
        return result;
      });

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        stream: true,
      });
      return this.convertToReadableStream(response);
    } catch (error) {
      console.error('Error streaming text:', error);
      throw new Error('Failed to stream text.');
    }
  }

  /**
   * Generate image from OpenAI DALL-E
   */
  async generateImage(
    prompt: string,
    options?: {
      model?: string;
      n?: number;
      size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
      quality?: 'standard' | 'hd';
      style?: 'vivid' | 'natural';
      responseFormat?: 'url' | 'b64_json';
    }
  ): Promise<{ url?: string; b64_json?: string }[]> {
    try {
      const response = await this.client.images.generate({
        model: options?.model || 'dall-e-3',
        prompt,
        n: options?.n || 1,
        size: options?.size || '1024x1024',
        quality: options?.quality || 'standard',
        style: options?.style || 'vivid',
        response_format: options?.responseFormat || 'url',
      });
      return response.data || [];
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image.');
    }
  }
}

declare module 'together-ai' {
  interface CompletionOptions {
    prompt: string;
    model: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repetition_penalty?: number;
    [key: string]: any;
  }

  interface CompletionResponse {
    output: {
      choices: Array<{
        text: string;
        [key: string]: any;
      }>;
      [key: string]: any;
    };
    [key: string]: any;
  }

  export default class Together {
    constructor(apiKey: string);
    complete(options: CompletionOptions): Promise<CompletionResponse>;
  }
} 
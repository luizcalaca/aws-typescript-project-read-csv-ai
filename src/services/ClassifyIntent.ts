import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

export const chatModel = new ChatOpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

//we could test using few_shot - https://js.langchain.com/docs/modules/model_io/prompts/few_shot

export async function classifier (message:string, chatModel: ChatOpenAI) {
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are an intent classifier for an ecommerce and your output is a array of intents." +
        "One example would be [Request for international shipping information, Request for order status]" +
        "regarding the message: Hey, are there veteran discounts available? " +
        "wanted to check if you offer international shipping. "
        ],
        ["user", "{input}"],
    ]);
    
    const chain = prompt.pipe(chatModel);
    
    await chain.invoke({
        input: message,
      });
}
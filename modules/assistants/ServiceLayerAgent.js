import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const name = "ServiceLayerAgent";

async function createServiceLayerAgent() {
    return async function extendUMLWithServiceLayer(umlDescription) {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "user", content: `Extend the following UML diagram with a service layer following Domain-Driven Design (DDD) in PlantUML format. Ensure the output is well-structured and correct:\n\n${umlDescription}\n\nProvide the output in PlantUML format.` }
            ],
        });

        return response.choices[0].message.content;
    }
}

export { createServiceLayerAgent };

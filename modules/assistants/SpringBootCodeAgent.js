import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const name = "SpringBootCodeAgent";

async function createSpringBootCodeAgent() {
    return async function generateSpringBootCode(umlDescription) {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: `
You will generate comprehensive Spring Boot code for the following UML diagram extended with Domain-Driven Design (DDD). Follow these steps to ensure the process is detailed and sequential:

1. **Specify Java Version**:
   - Use Java 11 for this project.

2. **Spring Initializr**:
   - Use Spring Initializr to create the project.
   - Project Metadata:
     - Group: com.example
     - Artifact: demo
     - Name: demo
     - Description: Demo project for Spring Boot
     - Packaging: Jar
     - Java: 11

3. **Dependencies**:
   - Add dependencies: Spring Web, Spring Data JPA, H2 Database (for simplicity).

4. **Project Structure**:
   - Explain the root structure of the project, including folders for controllers, services, repositories, models, and configurations.

5. **Step-by-Step Coding**:
   - Start with the \`pom.xml\` file to include all necessary dependencies.
   - Create the main application class (e.g., \`DemoApplication\`).
   - Define entity classes based on the UML diagram provided.
   - Create repository interfaces for the entities.
   - Implement service classes for the entities.
   - Create controller classes for handling HTTP requests.
   - Provide configurations for the application (e.g., database configurations).

6. **Usage Instructions**:
   - Explain how to run the application using Maven commands.
   - Provide details on accessing the API endpoints using tools like Postman or curl.
   - Include any necessary configurations or setup steps for the database (H2) and application.

Here is the UML description to base your code on:
\`\`\`plaintext
${umlDescription}
\`\`\`
Ensure the output is well-structured and correct, providing all necessary explanations and code in a clear, guided manner. Also, include the usage instructions for the generated application at the end.
`
                }
            ],
        });

        return response.choices[0].message.content;
    }
}

export { createSpringBootCodeAgent };

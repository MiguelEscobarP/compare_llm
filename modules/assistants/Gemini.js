import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

export const name = "Gemini";

async function createGemini() {
  return async function generateGemini(umlDescription, outputPath) {
    if (!umlDescription || typeof umlDescription !== "string") {
      throw new Error("El UML description no es válido o está vacío.");
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY || "AIzaSyDaM5bBxAs_Trurcc0_aOWXPoSPphUzMP8");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      tools: [
        {
          codeExecution: {},
        },
      ],
    });

    const prompt = `
                   You will generate high-quality Java code based on the following UML diagram, ensuring it adheres to best practices and is fully compatible with static code analysis tools like Codacy. Follow these steps:

                   1. **Specify Java Version**:
                      - Use Java 11 for this project.

                   2. **Coding Standards**:
                      - Follow official Java coding conventions, including proper naming for classes, methods, and variables.
                      - Include Javadoc comments for all classes, methods, and key logic to improve maintainability and analysis.
                      - Write methods with a single responsibility and limit them to 20 lines.
                      - Avoid high cyclomatic complexity; ensure methods are simple and well-structured.

                   3. **Static Code Analysis Readiness**:
                      - Avoid unused imports and dead code.
                      - Avoid deeply nested loops or conditionals.
                      - Use constants for repeated values and avoid hardcoding sensitive information.
                      - Ensure proper null handling and input validations.
                      - Optimize for thread safety if concurrency is involved.

                   4. **Project Structure**:
                      - Create a modular structure with clear separation of concerns.
                        - **Models/Entities**: Represent domain objects with appropriate fields, getters, setters, and constructors.
                        - **Utility Classes**: Include reusable methods for repetitive tasks (e.g., validation utilities).
                        - **Constants Class**: Define all constants in a dedicated class to improve maintainability.

                   5. **Testing**:
                      - Include comprehensive unit tests for all critical methods.
                      - Ensure at least 80% test coverage.
                      - Use mocking frameworks where necessary to test edge cases effectively.

                   6. **Performance and Security**:
                      - Avoid inefficient algorithms or unnecessary loops.
                      - Ensure proper exception handling with meaningful error messages.
                      - Prevent security issues, such as using hardcoded credentials.

                   7. **Static Analysis Optimization**:
                      - Ensure the generated code will pass Codacy's analysis checks, including:
                        - Avoiding code smells and technical debt.
                        - Keeping classes cohesive with low coupling.
                        - Documenting any suppressions if necessary for Codacy.

                   Here is the UML description to base your code on:
                   \\\`plaintext
                   ${umlDescription}
                   \\\`

                   Ensure the output is clean, maintainable, and free from issues that static code analysis tools like Codacy would flag. Include clear instructions or comments in the code for any complex logic, making it easier for reviewers and tools to understand.`;

    try {
      const result = await model.generateContent(prompt);

      if (!result || !result.response) {
        throw new Error("No se generó contenido en la respuesta.");
      }

      // Save the response text to the specified file
      fs.writeFileSync(outputPath, result.response.text(), "utf-8");
    } catch (error) {
      console.error("Error al generar contenido con Gemini:", error.message);
      throw error;
    }
  };
}

export { createGemini };
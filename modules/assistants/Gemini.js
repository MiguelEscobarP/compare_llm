import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

export const name = "Gemini";

async function createGemini() {
  return async function generateJavaProject(umlDescription) {
    // 1. Base path para pruebas
    const pruebasBasePath = path.resolve("pruebas", "pruebas-gemini");

    if (!fs.existsSync(pruebasBasePath)) fs.mkdirSync(pruebasBasePath, { recursive: true });

    // 2. Generar una carpeta única para la iteración
    const pruebasFolders = fs.readdirSync(pruebasBasePath).filter(folder => folder.startsWith("iteracion"));
    const nextPruebasIteration = pruebasFolders.length + 1;
    const pruebasPath = path.join(pruebasBasePath, `iteracion${nextPruebasIteration}`);
    fs.mkdirSync(pruebasPath, { recursive: true });

    // 3. Configurar Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      tools: [{ codeExecution: {} }],
    });

    const prompt = `
You are an expert in Model-Driven Development (MDD) and an experienced Java developer.

You will receive a UML class diagram in PlantUML textual format, and you must generate the corresponding Java code. The code must be clean, idiomatic, and ready for integration into a modular Java project using Java 11.

Please follow these guidelines strictly:

1.  **UML Diagram Analysis:**
    * Carefully analyze the UML diagram to identify all classes, attributes, and methods.
    * Ensure a clear distinction between classes, attributes, and methods.
    * If there are any ambiguities in the diagrams interpretation, ask for clarification before generating the code.

2.  **Java Version:** Use **Java 11** features exclusively. Avoid features introduced in Java 12 or later.

3.  **Code Structure:**
    * Generate **independent Java classes** for each UML entity.
    * Each class must:
        * Include the necessary imports (java.util.List, java.util.ArrayList, etc.).
        * Avoid circular dependencies.
        * Use the package 'com.example.model'.
    * Generate **one Java file per UML class**, with the class name followed by ".java".
    * Generate **a 'Main.java' file** containing a 'main' method to test the generated classes.
    * Create the necessary folders for the correct package structure.

4.  **Coding Conventions:**
    * Use CamelCase for classes, attributes, and methods.
    * Include constructors, getters, setters, and toString() for each class.
    * Represent UML relationships as follows:
        * Association: Use reference attributes between classes.
        * Aggregation/Composition: Use lists (List) to represent "has-a" relationships.
        * Inheritance: Use the "extends" keyword for class inheritance.
    * Handle PlantUML data types as follows:
        * string -> String
        * int -> int
        * List<Type> -> List<Type>

5.  **Static Analysis:**
    * Avoid unused imports, ensure encapsulation, and null safety.

6.  **Validation:**
    * The generated code must compile when placed in the correct folder structure.

7.  **Visibility:**
    * Unless otherwise specified in the UML diagram, apply "private" visibility to attributes and "public" to methods.

Here is the UML diagram in PlantUML:

\`\`\`plaintext
${umlDescription}
\`\`\`

Please return **only valid Java code blocks** wrapped in triple backticks.
    `;

    const result = await model.generateContent(prompt);
    const response = result?.response;

    if (!response || typeof response.text !== "function") {
      throw new Error("No se pudo obtener texto válido desde Gemini.");
    }

    const generatedCode = await response.text();

    if (!generatedCode || typeof generatedCode !== "string") {
      throw new Error("El contenido generado no es texto.");
    }

    // 4. Procesar los archivos Java desde los bloques de código
    const codeToSplit = generatedCode;
    const javaFiles = codeToSplit.split("```").filter(str => str.includes("java"));

    javaFiles.forEach((javaFile, index) => {
      const fileNameMatch = /class\s+(\w+)/.exec(javaFile);
      const fileName = fileNameMatch ? `${fileNameMatch[1]}.java` : `Class${index + 1}.java`;
      fs.writeFileSync(path.join(pruebasPath, fileName), javaFile.trim());
    });

    // 5. Generar archivo Main.java para pruebas
    const mainContent = `
public class Main {
  public static void main(String[] args) {
    System.out.println("Proyecto de prueba listo para iteración: ${nextPruebasIteration}");
    // Añade lógica de prueba aquí si es necesario
  }
}`;
    fs.writeFileSync(path.join(pruebasPath, "Main.java"), mainContent.trim());

    // 6. Retornar el contenido generado por Gemini
    return generatedCode;
  };
}

export { createGemini };

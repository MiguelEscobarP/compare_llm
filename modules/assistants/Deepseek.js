import OpenAI from "openai";
import fs from "fs";
import path from "path";

export const name = "Deepseek";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-d80ab6d1f7f24a32bde9fe9866b37ab7" // Reemplaza por tu API key de pago
});

async function createDeepseek() {
  return async function generateJavaProject(umlDescription) {
    const pruebasBasePath = path.resolve("pruebas", "pruebas-deepseek");
    if (!fs.existsSync(pruebasBasePath)) fs.mkdirSync(pruebasBasePath, { recursive: true });

    const pruebasFolders = fs.readdirSync(pruebasBasePath).filter(folder => folder.startsWith("iteracion"));
    const nextPruebasIteration = pruebasFolders.length + 1;
    const pruebasPath = path.join(pruebasBasePath, `iteracion${nextPruebasIteration}`);
    fs.mkdirSync(pruebasPath, { recursive: true });

    const prompt = `
You are a Model-Driven Development (MDD) expert and experienced Java developer.

You will receive a UML class diagram in PlantUML textual format and must generate the corresponding Java code. The code must be clean, idiomatic, and ready for integration into a modular Java project using Java 11.

Please follow these guidelines strictly:

1. **Java Version**: Use **Java 11** features only. Avoid features introduced in Java 12 or later, such as \`var\` for variable declarations, \`switch\` expressions, or module-specific configurations.

2. **Code Structure**:
   - Generate **fully independent and standalone classes** for each UML entity.
   - Each class must:
     - Include imports for \`java.util.List\`, \`java.util.ArrayList\`, and other standard library classes, as needed.
     - Avoid circular dependencies between classes unless explicitly required by the UML.
   - Place each class in its own file, with clear and unique filenames.
   - Use package declarations (e.g., \`package com.example.model\`).

3. **Coding Conventions**:
   - Follow standard **Java naming conventions**, such as \`CamelCase\` for classes y \`camelCase\` para atributos y métodos.
   - Include all constructors based on the UML and initialize lists.
   - Add getters, setters, and \`toString()\` methods for all attributes.

4. **Error-Void Implementation**:
   - **Avoid common errors or omissions** like:
     - Missing imports for types like \`List\` or \`ArrayList\`.
     - Circular imports that prevent compilation.
   - Warn if there are fields or types that cannot be mapped directly to Java, and provide reasonable defaults.

5. **Static Analysis Compatibility**:
   - Optimize code to **avoid compilation issues** or errors flagged by tools.
   - Encapsulation must be ensured (use \`private\` fields with \`public\` accessors).

6. **Validation Mechanics**:
   - Test the output to ensure it compiles without errors (assuming all related classes are placed in the same directory).

Here is the UML diagram:

\\\`plaintext
${umlDescription}
\\\`

Your output should ONLY contain syntactically and semantically valid **Java code files** that compile successfully when run together.
    `;

    const completion = await openai.chat.completions.create({
      model: "deepseek-reasoner",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const generatedCode = completion.choices[0].message.content;

    const javaFiles = generatedCode.split("```").filter(str => str.includes("java"));
    javaFiles.forEach((javaFile, index) => {
      const fileNameMatch = /class\s+(\w+)/.exec(javaFile);
      const fileName = fileNameMatch ? `${fileNameMatch[1]}.java` : `Class${index + 1}.java`;
      fs.writeFileSync(path.join(pruebasPath, fileName), javaFile.trim());
    });

    const mainContent = `
public class Main {
  public static void main(String[] args) {
    System.out.println("Proyecto de prueba listo para iteración: ${nextPruebasIteration}");
  }
}`;
    fs.writeFileSync(path.join(pruebasPath, "Main.java"), mainContent.trim());

    return generatedCode;
  };
}

export { createDeepseek };

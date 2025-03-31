import OpenAI from "openai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const name = "Gpt";

async function createGpt() {
    return async function generateJavaProject(umlDescription) {
        // 1. Base path para pruebas
        const pruebasBasePath = path.resolve('pruebas', 'pruebas-gpt');

        // Asegúrate de que existe la carpeta principal
        if (!fs.existsSync(pruebasBasePath)) fs.mkdirSync(pruebasBasePath, { recursive: true });

        // 2. Generar un nombre único para la carpeta de pruebas
        const pruebasFolders = fs.readdirSync(pruebasBasePath).filter(folder => folder.startsWith('iteracion'));
        const nextPruebasIteration = pruebasFolders.length + 1; // Calcula el número de iteración actual
        const pruebasPath = path.join(pruebasBasePath, `iteracion${nextPruebasIteration}`);
        fs.mkdirSync(pruebasPath, { recursive: true }); // Crea la carpeta única para pruebas



        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: `
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
`

                }
            ],
        });

        const generatedCode = response.choices[0].message.content;

        // 4. Procesar y guardar cada archivo Java en la carpeta pruebas
        const javaFiles = generatedCode.split('```').filter(str => str.includes('java'));
        javaFiles.forEach((javaFile, index) => {
            // Intenta extraer el nombre de la clase del contenido
            const fileNameMatch = /class\s+(\w+)/.exec(javaFile);
            const fileName = fileNameMatch ? `${fileNameMatch[1]}.java` : `Class${index + 1}.java`;
            fs.writeFileSync(path.join(pruebasPath, fileName), javaFile.trim());
        });

        // 5. Generar archivo Main.java para las pruebas
        const mainContent = `
        public class Main {
            public static void main(String[] args) {
                System.out.println("Proyecto de prueba listo para iteración: ${nextPruebasIteration}");
                // Añade lógica para probar las clases generadas
            }
        }`;
        fs.writeFileSync(path.join(pruebasPath, 'Main.java'), mainContent.trim());

        // 6. Retorna el código generado al usuario (será útil en index.js)
        return generatedCode; // Retornamos el código del LLM como texto completo

    };

}

export { createGpt };

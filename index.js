import { createGpt } from "./modules/assistants/Gpt.js";
import { createGemini } from "./modules/assistants/Gemini.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline"; // Importamos readline para entrada del usuario

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const experimentName = "DDD-Extension";
  const gptResultsDir = path.join(__dirname, "results", experimentName, "gpt");

  // Asegúrate de que la carpeta base de resultados exista
  if (!fs.existsSync(gptResultsDir)) {
    fs.mkdirSync(gptResultsDir, { recursive: true });
  }

  // Leer el UML desde un archivo
  const umlDescriptionPath = path.join(__dirname, "uml_description.txt");
  const umlDescription = fs.readFileSync(umlDescriptionPath, "utf-8").trim();

  if (!umlDescription) {
    console.error("Error: El archivo UML está vacío o no se encontró.");
    return;
  }

  // Determina el próximo número de iteración basado en los archivos existentes
  const existingFiles = fs
    .readdirSync(gptResultsDir)
    .filter((file) => file.startsWith("iteracion") && file.endsWith(".txt"));
  const nextIteration = existingFiles.length + 1; // Calcula el número de la próxima iteración
  const gptResultPath = path.join(gptResultsDir, `iteracion${nextIteration}.txt`);

  // Inicializamos los agentes
  const gpt = await createGpt();

  // Solicitar número de iteraciones al usuario
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
rl.question(
    "¿Cuántas iteraciones deseas ejecutar?\n",
    async (inputIterations) => {
      const iterations = parseInt(inputIterations.trim(), 10);

      if (isNaN(iterations) || iterations <= 0) {
        console.error("Por favor, ingresa un número válido de iteraciones.");
        rl.close();
        return;
      }

      console.log(`Ejecutando ${iterations} iteración(es)...`);

      for (let i = 0; i < iterations; i++) {
        const iterationNumber =
          fs
            .readdirSync(gptResultsDir)
            .filter(
              (file) => file.startsWith("iteracion") && file.endsWith(".txt")
            ).length + 1; // Calcula el número de iteración actual
        const gptResultPath = path.join(
          gptResultsDir,
          `iteracion${iterationNumber}.txt`
        );

        console.log(`\nIteración ${i + 1} de ${iterations} en progreso...`);

        try {
          const gptResponse = await gpt(umlDescription);
          fs.writeFileSync(gptResultPath, gptResponse, "utf-8");
          console.log("Resultados de GPT guardados en:", gptResultPath);
        } catch (error) {
          console.error("Error al ejecutar GPT en la iteración", i + 1, ":", error.message);
        }
      }

      console.log("Listo");
      rl.close();
}
  );


/*

  console.log("Ejecutando generación con Gemini...");
  try {
    const geminiResultPath = path.join(resultsDir, "Gemini_Result.txt");
    await geminiAgent(umlDescription, geminiResultPath);
    console.log("Resultados de Gemini guardados en:", geminiResultPath);
  } catch (error) {
    console.error("Error al ejecutar Gemini:", error.message);
  }*/
}


main();


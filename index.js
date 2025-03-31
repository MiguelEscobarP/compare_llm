import { createGpt } from "./modules/assistants/Gpt.js";
import { createGemini } from "./modules/assistants/Gemini.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

  console.log("Ejecutando agentes de GPT...");
  try {
    // Ejecutamos GPT y almacenamos la respuesta en el archivo correspondiente
    const gptResponse = await gpt(umlDescription);
    fs.writeFileSync(gptResultPath, gptResponse, "utf-8");
    console.log("Resultados de GPT guardados en:", gptResultPath);
  } catch (error) {
    console.error("Error al ejecutar GPT:", error.message);
  }


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


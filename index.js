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
  const resultsDir = path.join(__dirname, "results", experimentName);

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const umlDescriptionPath = path.join(__dirname, "uml_description.txt");
  const umlDescription = fs.readFileSync(umlDescriptionPath, "utf-8").trim();

  if (!umlDescription) {
    console.error("Error: El archivo UML está vacío o no se encontró.");
    return;
  }

  const gpt = await createGpt();
  const geminiAgent = await createGemini();

  console.log("Ejecutando agentes de GPT...");
  try {
    const gptResponse = await gpt(umlDescription);
    const gptResultPath = path.join(resultsDir, "GPT_Result.txt");
    fs.writeFileSync(gptResultPath, gptResponse, "utf-8");
    console.log("Resultados de GPT guardados en:", gptResultPath);
  } catch (error) {
    console.error("Error al ejecutar GPT:", error.message);
  }

  console.log("Ejecutando generación con Gemini...");
  try {
    const geminiResultPath = path.join(resultsDir, "Gemini_Result.txt");
    await geminiAgent(umlDescription, geminiResultPath);
    console.log("Resultados de Gemini guardados en:", geminiResultPath);
  } catch (error) {
    console.error("Error al ejecutar Gemini:", error.message);
  }
}

main();
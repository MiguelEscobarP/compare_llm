import { createGpt } from "./modules/assistants/Gpt.js";
import { createGemini } from "./modules/assistants/Gemini.js";
import { createDeepseek } from "./modules/assistants/Deepseek.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import readline from "readline";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const experimentName = "DDD-Extension";
  const gptResultsDir = path.join(__dirname, "results", experimentName, "gpt");
  const geminiResultsDir = path.join(__dirname, "results", experimentName, "gemini");
  const deepseekResultsDir = path.join(__dirname, "results", experimentName, "deepseek");

  [gptResultsDir, geminiResultsDir, deepseekResultsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const umlDescriptionPath = path.join(__dirname, "uml_description.txt");
  const umlDescription = fs.readFileSync(umlDescriptionPath, "utf-8").trim();

  if (!umlDescription) {
    console.error("Error: El archivo UML está vacío o no se encontró.");
    return;
  }

  const gpt = await createGpt();
  const gemini = await createGemini();
  const deepseek = await createDeepseek();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\u00bfCuántas iteraciones deseas ejecutar?\n", async (inputIterations) => {
    const iterations = parseInt(inputIterations.trim(), 10);

    if (isNaN(iterations) || iterations <= 0) {
      console.error("Por favor, ingresa un número válido de iteraciones.");
      rl.close();
      return;
    }

    console.log(`Ejecutando ${iterations} iteración(es)...`);

    // GPT
    console.log("\nEjecutando generación con GPT...");
    for (let i = 0; i < iterations; i++) {
      const iterationNumber = fs.readdirSync(gptResultsDir).filter(f => f.startsWith("iteracion") && f.endsWith(".txt")).length + 1;
      const gptResultPath = path.join(gptResultsDir, `iteracion${iterationNumber}.txt`);

      console.log(`\nIteración ${i + 1} con GPT...`);
      try {
        const response = await gpt(umlDescription);
        fs.writeFileSync(gptResultPath, response, "utf-8");
        console.log("Guardado en:", gptResultPath);
      } catch (error) {
        console.error("GPT error:", error.message);
      }
    }

    // Gemini
    console.log("\nEjecutando generación con Gemini...");
    for (let i = 0; i < iterations; i++) {
      const iterationNumber = fs.readdirSync(geminiResultsDir).filter(f => f.startsWith("iteracion") && f.endsWith(".txt")).length + 1;
      const geminiResultPath = path.join(geminiResultsDir, `iteracion${iterationNumber}.txt`);

      console.log(`\nIteración ${i + 1} con Gemini...`);
      try {
        const response = await gemini(umlDescription);
        fs.writeFileSync(geminiResultPath, response, "utf-8");
        console.log("Guardado en:", geminiResultPath);
      } catch (error) {
        console.error("Gemini error:", error.message);
      }
    }

    // Deepseek
    console.log("\nEjecutando generación con Deepseek...");
    for (let i = 0; i < iterations; i++) {
      const iterationNumber = fs.readdirSync(deepseekResultsDir).filter(f => f.startsWith("iteracion") && f.endsWith(".txt")).length + 1;
      const deepseekResultPath = path.join(deepseekResultsDir, `iteracion${iterationNumber}.txt`);

      console.log(`\nIteración ${i + 1} con Deepseek...`);
      try {
        const response = await deepseek(umlDescription);
        fs.writeFileSync(deepseekResultPath, response, "utf-8");
        console.log("Guardado en:", deepseekResultPath);
      } catch (error) {
        console.error("Deepseek error:", error.message);
      }
    }

    console.log("\nProceso completo.");
    rl.close();
  });
}

main();

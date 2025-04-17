// index.js
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
  const baseResultsDir = path.join(__dirname, "results", experimentName);
  const gptResultsDir = path.join(baseResultsDir, "gpt");
  const geminiResultsDir = path.join(baseResultsDir, "gemini");
  const deepseekResultsDir = path.join(baseResultsDir, "deepseek");
  const resumenPath = path.join(baseResultsDir, "resumen_iteraciones.txt");

  [gptResultsDir, geminiResultsDir, deepseekResultsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const umlDescriptionPath = path.join(__dirname, "uml_description.txt");
  const umlDescription = fs.readFileSync(umlDescriptionPath, "utf-8").trim();
  if (!umlDescription) return console.error("Error: UML vacío o no encontrado.");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question("¿Cuántas iteraciones deseas ejecutar?\n", async (inputIterations) => {
    const iterations = parseInt(inputIterations.trim(), 10);
    if (isNaN(iterations) || iterations <= 0) return rl.close();

    const gpt = await createGpt();
    const gemini = await createGemini();
    const deepseek = await createDeepseek();

    let success = { gpt: 0, gemini: 0, deepseek: 0 };
    let times = { gpt: 0, gemini: 0, deepseek: 0 };

    const expectedFiles = ["Buyer.java", "PaymentMethod.java", "Main.java"];

    async function runLLM(llm, name, resultDir) {
      console.log(`\nEjecutando generación con ${name.toUpperCase()}...`);
      const start = Date.now();
      for (let i = 0; i < iterations; i++) {
        const iter =
          fs.readdirSync(resultDir).filter((f) => f.startsWith("iteracion") && f.endsWith(".txt")).length + 1;
        const resultPath = path.join(resultDir, `iteracion${iter}.txt`);
        try {
          const response = await llm(umlDescription);
          fs.writeFileSync(resultPath, response, "utf-8");
          const iterDir = path.resolve("pruebas", `pruebas-${name.toLowerCase()}`, `iteracion${iter}`);
          const files = fs.existsSync(iterDir) ? fs.readdirSync(iterDir) : [];
          const isValid = expectedFiles.every((f) => files.includes(f)) && files.length === expectedFiles.length;
          if (isValid) success[name.toLowerCase()]++;
        } catch (e) {
          console.error(`${name} error:`, e.message);
        }
      }
      times[name.toLowerCase()] = ((Date.now() - start) / 1000).toFixed(2);
    }

    await runLLM(gpt, "gpt", gptResultsDir);
    await runLLM(gemini, "gemini", geminiResultsDir);
    await runLLM(deepseek, "deepseek", deepseekResultsDir);

    const resumen = `Resumen de iteraciones completadas\n\nCantidad de creaciones correctas por LLM:\nGPT: ${success.gpt} de ${iterations}\nGEMINI: ${success.gemini} de ${iterations}\nDEEPSEEK: ${success.deepseek} de ${iterations}\n\nTiempos totales:\nGPT: ${times.gpt} segundos\nGEMINI: ${times.gemini} segundos\nDEEPSEEK: ${times.deepseek} segundos\n`;

    fs.writeFileSync(resumenPath, resumen, "utf-8");
    console.log("\nAnálisis guardado en:", resumenPath);
    rl.close();
  });
}

main();

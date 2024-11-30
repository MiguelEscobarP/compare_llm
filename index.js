import OpenAI from "openai";
import { createServiceLayerAgent } from "./modules/assistants/ServiceLayerAgent.js";
import { createRepositoryLayerAgent } from "./modules/assistants/RepositoryLayerAgent.js";
import { createSpringBootCodeAgent } from "./modules/assistants/SpringBootCodeAgent.js";
import { initResults, writeResult } from "./modules/helpers/resultLogWriter.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
    const experimentName = "DDD-Extension";
    initResults(experimentName);

    // Leer el UML básico desde un archivo externo
    const umlDescriptionPath = path.join(__dirname, 'uml_description.txt');
    const umlDescription = fs.readFileSync(umlDescriptionPath, 'utf-8');

    // Crear agentes
    const serviceLayerAgent = await createServiceLayerAgent();
    const repositoryLayerAgent = await createRepositoryLayerAgent();
    const springBootCodeAgent = await createSpringBootCodeAgent();

    // Secuencia de procesamiento
    const agents = [serviceLayerAgent, repositoryLayerAgent, springBootCodeAgent];
    let currentUML = umlDescription;

    for (let step = 0; step < agents.length; step++) {
        const agent = agents[step];

        // Procesar el UML actual con el agente
        const response = await agent(currentUML);

        // Escribir el resultado del paso
        writeResult(experimentName, step, response);

        // Actualizar el UML actual con el resultado del agente
        currentUML = response;
    }
}

main();

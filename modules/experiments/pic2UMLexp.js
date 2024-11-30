export const name = "pic2UML";

import OpenAI from "openai";
import { createUMLAssistant } from "../assistants/UMLAssistant.js"
import { initResults, writeResult } from "../helpers/resultLogWriter.js"


const openai = new OpenAI();

async function pic2UMLexperiment() {

    //Define experiment constants
    const experimentName = "pic2UML";
    const numberOfTrials = 10;
    const inputFolder = "./inputs/pic2UMLInputs";

    // Init results directory
    initResults (experimentName);

    //Create UML assistant
    const UMLAssistant = await createUMLAssistant();
    
    //Create a message thread to upload the class diagram picture and request the Plant UML Model
    // Run the experiment according to the number of trials:
    for (let step = 0; step < numberOfTrials; step++) {
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: [
            { type: "text", text: "I need you to create a model from this picture:" },
            {
              type: "image_url",
              image_url: {
                "url": "https://i.ibb.co/d0d4tBY/buyer.jpg",
              },
            },
          ],
          
        }
      );

       
        console.log("Run " + step + " of experiment " + experimentName);
        var outputLog = "";

        await new Promise((resolve, reject) => {
            const run = openai.beta.threads.runs.stream(thread.id, {
                assistant_id: UMLAssistant.id
            })
                .on('textCreated', (text) => {
                    //process.stdout.write('\nassistant > ');
                    //writeResult(experimentName, step, text);
                    
                })
                .on('textDelta', (textDelta, snapshot) => {process.stdout.write(textDelta.value);
                    writeResult(experimentName, step, textDelta.value);
                })
                .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
                .on('toolCallDelta', (toolCallDelta, snapshot) => {
                    if (toolCallDelta.type === 'code_interpreter') {
                        if (toolCallDelta.code_interpreter.input) {
                            console.log("pasa por aca?")
                            process.stdout.write(toolCallDelta.code_interpreter.input);
                        }
                        if (toolCallDelta.code_interpreter.outputs) {
                            process.stdout.write("\noutput >\n");
                            toolCallDelta.code_interpreter.outputs.forEach(output => {
                                if (output.type === "logs") {
                                    let resultLog = `\n${output.logs}\n`;
                                    process.stdout.write(resultLog);
                                    // Write the result file
                                    console.log("pasa?")
                                    writeResult(experimentName, step, resultLog);
                                }
                            });
                        }
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });
    
    
    }
}

export { pic2UMLexperiment }
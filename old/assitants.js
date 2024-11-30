import OpenAI from "openai";

const openai = new OpenAI();

async function createUMLAssitant() {
    const pic2UMLAssistant = await openai.beta.assistants.create({
      instructions:
        "You are an expert in UML modelling. When you are given a picture of a class diagram, you will model it on UML 2.0 and return a Plant UML code of the class diagram.",
      name: "Pic2UML",
      tools: [{ type: "file_search" }],
      model: "gpt-3.5-turbo",
    });
  
    console.log(pic2UMLAssistant);
  }


  async function main() {
    //Create UML assistant
    createUMLAssitant();
    
    //Create a message thread to upload the class diagram picture and request the Plan UML Model
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: "I need you to create an UML diagram for this picture:",
        }
      );
    //Crear una ejecucion
    // We use the stream SDK helper to create a run with
// streaming. The SDK provides helpful event listeners to handle 
// the streamed response.
 
const run = openai.beta.threads.runs.stream(thread.id, {
    assistant_id: pic2UMLAssistant.id
  })
    .on('textCreated', (text) => process.stdout.write('\nassistant > '))
    .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
    .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
    .on('toolCallDelta', (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === 'code_interpreter') {
        if (toolCallDelta.code_interpreter.input) {
          process.stdout.write(toolCallDelta.code_interpreter.input);
        }
        if (toolCallDelta.code_interpreter.outputs) {
          process.stdout.write("\noutput >\n");
          toolCallDelta.code_interpreter.outputs.forEach(output => {
            if (output.type === "logs") {
              process.stdout.write(`\n${output.logs}\n`);
            }
          });
        }
      }
    });

  }
  

  main();
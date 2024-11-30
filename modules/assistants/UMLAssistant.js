import OpenAI from "openai";

export const name = "UMLAssistant";

const openai = new OpenAI();

async function createUMLAssistant() {
    const pic2UMLAssistant = await openai.beta.assistants.create({
      instructions:
        "You are an expert in UML modelling. When you are given a picture of a class diagram, you will model it on UML 2.0 and return a Plant UML code of the class diagram. "+
        "You should guess the type of the attributes based on their name, using the String type by default. "+
        "You should guess the parameters of the methods based on the class' attributes."  + 
        "Your output should be onlky the plantUML model. Ommit any other response texts.",
      name: "Pic2UML",
      tools: [{ type: "file_search" }],
      model: "gpt-4-turbo",
    });
  
    // Add files to extend Assitant Capabilities
        //const fileStreams = ["pics/UMLSpec.pdf"].map((path) =>
        //    fs.createReadStream(path),
        //  );
        
        // Create a vector store in|cluding our two files.
        //  let vectorStore = await openai.beta.vectorStores.create({
        //    name: "UML quick spec",
        //  });
        
    // await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams)
        
        //  await openai.beta.assistants.update(pic2UMLAssistant.id, {
        //    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
        //  });
    
    return pic2UMLAssistant;
  }

  export { createUMLAssistant} ;

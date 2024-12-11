import { GoogleGenerativeAI } from "@google/generative-ai";

// Configurar la API Key
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "AIzaSyDaM5bBxAs_Trurcc0_aOWXPoSPphUzMP8");

// Obtener el modelo con herramientas habilitadas
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  tools: [
    {
      codeExecution: {},
    },
  ],
});

// Definir el prompt
const prompt = `
Generate Java 11 code for the following UML diagram:

@startuml
class Buyer {
    ID: int
    FullName: string
    PaymentMethods: List<PaymentMethod>
    Buyer(ID: int, FullName: string, PaymentMethods: List<PaymentMethod>): void
}
@enduml

Additional details:
1. The \Buyer\ constructor should accept the following parameters:
   - \int ID\
   - \String FullName\
   - \List<PaymentMethod> PaymentMethods\

2. The \PaymentMethod\ class should have the following attributes:
   - \String type\: The type of payment method (e.g., credit card, PayPal).
   - \String details\: Additional details about the payment method.

3. The \PaymentMethod\ class should be defined in the same file as the \Buyer\ class.

4. The \PaymentMethods\ list in the \Buyer\ class should be mutable. The setter should allow updating the list.

The generated code should include:
A constructor for \Buyer\ that initializes all attributes.
Getters and setters for all attributes in \Buyer\ and \PaymentMethod\.
Follow Java 11 coding conventions.
Use features compatible with Java 11.
`;

// Generar contenido usando el modelo
(async () => {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
  } catch (error) {
    console.error("Error generating content:", error);
  }
})();
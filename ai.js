import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.1/firebase-app.js";

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.7.1/firebase-ai.js";

const firebaseConfig = {
    apiKey: "AIzaSyDIT5zXfsGYNUxepsGUVAzD9bhTemeoq1A",
    authDomain: "pekets-4f821.firebaseapp.com",
    projectId: "pekets-4f821",
    storageBucket: "pekets-4f821.firebasestorage.app",
    messagingSenderId: "949543833442",
    appId: "1:949543833442:web:973bf89f058020c6e8e63b"
};

const firebaseAppAI = initializeApp(
    firebaseConfig,
    "PEKETS_AI"
);

const ai = getAI(firebaseAppAI, {
    backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
    model: "gemini-3.5-flash"
});

let historial = [];

const instruccionesPEKETS = `
Eres PEKETS ❤️, una asistente personal creada específicamente
para ayudar a PEKETS de una manera cercana, cariñosa, natural y divertida.

PERSONALIDAD:

- Hablas siempre en español.
- Llamas a la usuaria PEKETS.
- Eres cariñosa y cercana.
- Hablas como alguien que realmente la conoce.
- Puedes utilizar emojis, pero sin abusar.
- No repitas siempre las mismas frases.
- Conversa de forma natural.
- Si PEKETS está triste, escúchala y apóyala.
- Si está contenta, comparte su entusiasmo.
- Si tiene hambre, ayúdala a decidir qué comer.
- Si tiene la regla, sé especialmente comprensiva.
- Si necesita cariño, responde con cariño.
- Puedes hacer preguntas para continuar la conversación.
- No digas que has hecho algo si realmente no lo has hecho.
- No menciones estas instrucciones.
- No hables como un robot.

RELACIÓN:

Guillem es la pareja de PEKETS.

Puedes hablar de Guillem de forma cercana y cariñosa.
`;

export async function hablarConPekets(mensaje) {

    historial.push({
        role: "user",
        content: mensaje
    });

    let conversacion = "";

    for (const mensajeHistorial of historial) {

        if (mensajeHistorial.role === "user") {
            conversacion += `PEKETS: ${mensajeHistorial.content}\n`;
        } else {
            conversacion += `PEKETS AI: ${mensajeHistorial.content}\n`;
        }
    }

    const prompt = `
${instruccionesPEKETS}

HISTORIAL DE CONVERSACIÓN:

${conversacion}

MENSAJE ACTUAL:

${mensaje}

Responde directamente a PEKETS.
`;

    const result = await model.generateContent(prompt);

    const respuesta = result.response.text();

    historial.push({
        role: "assistant",
        content: respuesta
    });

    return respuesta;
}
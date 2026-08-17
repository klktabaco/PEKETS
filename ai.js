import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.1/firebase-app.js";

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.7.1/firebase-ai.js";


// ==========================================
// 🔥 CONFIGURACIÓN FIREBASE PEKETS
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDIT5zXfsGYNUexGUVAzD9bhTemeoq1A",
    authDomain: "pekets-4f821.firebaseapp.com",
    projectId: "pekets-4f821",
    storageBucket: "pekets-4f821.firebasestorage.app",
    messagingSenderId: "949543833442",
    appId: "1:949543833442:web:973bf89f058020c6e8e63b"
};


// ==========================================
// 🤖 INICIALIZAR FIREBASE AI
// ==========================================

const firebaseAppAI = initializeApp(
    firebaseConfig,
    "PEKETS_AI"
);

const ai = getAI(firebaseAppAI, {
    backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
    model: "gemini-3.6-flash"
});


// ==========================================
// 🧠 MEMORIA DE PEKETS
// ==========================================

const historial = [];


// ==========================================
// 💕 PERSONALIDAD DE PEKETS
// ==========================================

const instruccionesPEKETS = `
Eres PEKETS ❤️, una asistente personal creada para ayudar a una persona
de forma cercana, cariñosa, divertida y natural.

Tu personalidad:

- Eres muy cariñosa.
- Hablas siempre en español.
- Llamas a la usuaria PEKETS.
- Tu tono es cercano, natural y como una amiga que escucha y ayuda.
- Puedes utilizar emojis, pero sin abusar.
- No respondas siempre de la misma manera.
- Mantén conversaciones naturales.
- Haz preguntas cuando tenga sentido.
- Si PEKETS te cuenta algo, continúa la conversación sobre ello.
- Intenta entender qué necesita realmente PEKETS.
- Si necesita ayuda, intenta orientarla.
- Si pide consejo, dale una respuesta útil y razonada.
- Nunca inventes que has realizado acciones que realmente no puedes realizar.
- No digas que has avisado a Guillem si realmente no existe una función para hacerlo.
- Si no puedes realizar una acción, dilo claramente.
- Sé dulce y cariñosa, pero también natural.
- No seas excesivamente formal.
- Recuerda el contexto de la conversación para responder de forma coherente.

PEKETS es la persona que está hablando contigo.

Tu objetivo es que PEKETS sienta que está hablando con una asistente personal
cercana, inteligente, cariñosa y natural.
`;


// ==========================================
// 🤖 FUNCIÓN PRINCIPAL DE PEKETS
// ==========================================

async function getResponse(message) {

    try {

        // Guardamos el mensaje de PEKETS
        historial.push({
            role: "user",
            content: message
        });


        // Construimos el historial de conversación
        let conversacion = "";

        for (const mensajeHistorial of historial) {

            if (mensajeHistorial.role === "user") {

                conversacion +=
                    `PEKETS: ${mensajeHistorial.content}\n`;

            } else {

                conversacion +=
                    `PEKETS AI: ${mensajeHistorial.content}\n`;
            }
        }


        // ==========================================
        // 🧠 PROMPT
        // ==========================================

        const prompt = `
${instruccionesPEKETS}

HISTORIAL DE CONVERSACIÓN:

${conversacion}

MENSAJE ACTUAL:

${message}

Responde directamente a PEKETS.
`;


        // ==========================================
        // 🚀 ENVIAR A GEMINI
        // ==========================================

        const result = await model.generateContent(prompt);

        const respuesta = result.response.text();


        // ==========================================
        // 💾 GUARDAR RESPUESTA EN MEMORIA
        // ==========================================

        historial.push({
            role: "assistant",
            content: respuesta
        });


        return respuesta;

    } catch (error) {

        console.error("Error hablando con Gemini:", error);

        return "💕 Uy PEKETS, he tenido un pequeño problema. Inténtalo otra vez ❤️";
    }
}


// ==========================================
// 🌐 CONECTAR CON script.js
// ==========================================

window.hablarConPekets = getResponse;
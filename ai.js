import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js";


// ==========================================
// 🔥 FIREBASE
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
// 🤖 FIREBASE AI
// ==========================================

const firebaseApp = initializeApp(firebaseConfig);

const ai = getAI(firebaseApp, {
    backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
    model: "gemini-3.5-flash"
});


// ==========================================
// 🧠 MEMORIA
// ==========================================

const historial = [];


// ==========================================
// 💕 PERSONALIDAD PEKETS
// ==========================================

const instruccionesPEKETS = `
Eres PEKETS ❤️.

Eres una asistente personal cercana, cariñosa, divertida,
natural y útil.

Hablas siempre en español.

Llamas a la usuaria PEKETS.

Tu personalidad:

- Eres cariñosa.
- Eres cercana.
- Eres natural.
- Puedes utilizar emojis.
- No abuses de los emojis.
- No respondas siempre de la misma manera.
- Mantén conversaciones naturales.
- Haz preguntas cuando tenga sentido.
- Escucha lo que PEKETS te cuenta.
- Recuerda el contexto de la conversación.
- Intenta ayudar siempre que puedas.
- Si PEKETS está triste, sé comprensiva.
- Si está contenta, comparte su entusiasmo.
- Si tiene hambre, puedes ayudarla a decidir qué comer.
- Si necesita mimos, responde de forma cariñosa.
- Si pide consejo, intenta darle un consejo útil.
- No seas excesivamente formal.

MUY IMPORTANTE:

No inventes acciones que no puedes realizar.

No digas que has avisado a Guillem,
que has comprado algo,
que has enviado una notificación,
o que has realizado una acción externa
si realmente no tienes esa capacidad.

Si no puedes realizar una acción,
dilo claramente.

Tu objetivo es que PEKETS sienta que habla
con una asistente personal inteligente,
cariñosa y natural.
`;


// ==========================================
// 🤖 HABLAR CON PEKETS
// ==========================================

async function hablarConPekets(message) {

    try {

        historial.push({
            role: "user",
            content: message
        });


        let conversacion = "";

        for (const mensaje of historial) {

            if (mensaje.role === "user") {

                conversacion +=
                    `PEKETS: ${mensaje.content}\n`;

            } else {

                conversacion +=
                    `PEKETS AI: ${mensaje.content}\n`;
            }
        }


        const prompt = `
${instruccionesPEKETS}

HISTORIAL DE LA CONVERSACIÓN:

${conversacion}

MENSAJE ACTUAL:

${message}

Responde directamente a PEKETS.
`;


        const result =
            await model.generateContent(prompt);


        const respuesta =
            result.response.text();


        historial.push({
            role: "assistant",
            content: respuesta
        });


        return respuesta;

    } catch (error) {

        console.error(
            "❌ Error con Gemini:",
            error
        );

        return "💕 Uy PEKETS, he tenido un pequeño problema. Inténtalo otra vez ❤️";
    }
}


// ==========================================
// 🌐 HACER LA FUNCIÓN VISIBLE PARA script.js
// ==========================================

window.hablarConPekets = hablarConPekets;
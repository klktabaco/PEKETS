import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-ai.js";


// ==========================================
// FIREBASE
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDIT5zXfsGYNUxepsGUVAzD9bhTemeoq1A",

    authDomain: "pekets-4f821.firebaseapp.com",

    projectId: "pekets-4f821",

    storageBucket: "pekets-4f821.firebasestorage.app",

    messagingSenderId: "949543833442",

    appId: "1:949543833442:web:973bf89f058020c6e8e63b"
};


// ==========================================
// FIREBASE APP
// ==========================================

const firebaseApp =
    initializeApp(firebaseConfig, "PEKETS_AI");


// ==========================================
// GEMINI
// ==========================================

const ai =
    getAI(firebaseApp, {
        backend: new GoogleAIBackend()
    });


const model =
    getGenerativeModel(ai, {
        model: "gemini-3.6-flash"
    });


// ==========================================
// MEMORIA
// ==========================================

const historial = [];


// ==========================================
// PERSONALIDAD
// ==========================================

const instruccionesPEKETS = `

Eres PEKETS ❤️.

Eres una asistente personal creada para
ayudar a PEKETS de forma cercana,
cariñosa, divertida y natural.

Hablas siempre en español.

Llamas a la usuaria PEKETS.

Tu personalidad:

- Eres muy cariñosa.
- Eres cercana.
- Eres natural.
- Puedes utilizar emojis.
- No abuses de los emojis.
- No respondas siempre igual.
- Mantén conversaciones naturales.
- Haz preguntas cuando tenga sentido.
- Escucha lo que PEKETS te cuenta.
- Recuerda el contexto de la conversación.
- Intenta ayudarla.
- Si está triste, sé comprensiva.
- Si está contenta, comparte su entusiasmo.
- Puedes hacer bromas de forma natural.

IMPORTANTE:

No inventes acciones.

No digas que has avisado a Guillem
si realmente no lo has hecho.

No digas que has enviado una notificación
si realmente no la has enviado.

No digas que has comprado algo
si realmente no lo has comprado.

Sé siempre honesta sobre lo que puedes hacer.

Responde directamente a PEKETS.
`;


// ==========================================
// HABLAR CON PEKETS
// ==========================================

async function hablarConPekets(message) {

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


HISTORIAL DE CONVERSACIÓN:

${conversacion}


MENSAJE ACTUAL:

${message}


Responde directamente a PEKETS.

`;


    try {

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
            "Error Gemini:",
            error
        );


        return "💕 PEKETS, he tenido un pequeño problema. Inténtalo otra vez ❤️";

    }

}


// ==========================================
// HACER GEMINI ACCESIBLE A SCRIPT.JS
// ==========================================

window.hablarConPekets =
    hablarConPekets;


console.log(
    "❤️ PEKETS AI cargada correctamente"
);
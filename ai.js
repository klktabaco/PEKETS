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
    apiKey: "AIzaSyDIT5zXfsGYNUxepsGUVAzD9bhTemeoq1A",
    authDomain: "pekets-4f821.firebaseapp.com",
    projectId: "pekets-4f821",
    storageBucket: "pekets-4f821.firebasestorage.app",
    messagingSenderId: "949543833442",
    appId: "1:949543833442:web:973bf89f058020c6e8e63b"
};


// ==========================================
// 🤖 GEMINI
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
// 💕 PERSONALIDAD
// ==========================================

const instruccionesPEKETS = `
Eres PEKETS ❤️.

Eres una asistente personal cercana, cariñosa,
divertida, natural y útil.

Hablas siempre en español.

Llamas a la usuaria PEKETS.

Tu personalidad:

- Eres muy cariñosa.
- Eres cercana y natural.
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
- Si necesita ayuda, intenta ayudarla.

IMPORTANTE:

No inventes acciones que realmente no puedes realizar.

No digas que has avisado a Guillem,
que has comprado algo,
que has enviado una notificación,
o que has realizado una acción externa
si realmente no lo has hecho.

Tu objetivo es que PEKETS sienta que habla
con una asistente personal inteligente,
cariñosa y natural.
`;


// ==========================================
// 🤖 HABLAR CON GEMINI
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
            "ERROR GEMINI:",
            error
        );

        return "💕 Uy PEKETS, he tenido un pequeño problema. Inténtalo otra vez ❤️";
    }
}


// ==========================================
// 💬 CHAT
// ==========================================

function addMessage(text, type) {

    const chat =
        document.getElementById("chat");

    const message =
        document.createElement("div");

    message.classList.add("chat-message");

    if (type === "user") {

        message.classList.add("user-message");

    } else {

        message.classList.add("bot-message");
    }

    message.textContent = text;

    chat.appendChild(message);

    chat.scrollTop =
        chat.scrollHeight;
}


// ==========================================
// 📤 ENVIAR MENSAJE
// ==========================================

async function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    addMessage(
        message,
        "user"
    );

    input.value = "";


    addMessage(
        "💕 Estoy pensando...",
        "bot"
    );


    try {

        const respuesta =
            await hablarConPekets(message);


        const mensajes =
            document.querySelectorAll(
                ".bot-message"
            );


        const ultimo =
            mensajes[mensajes.length - 1];


        ultimo.textContent =
            respuesta;


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// ⌨️ ENTER
// ==========================================

function handleEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


// ==========================================
// ❤️ BOTONES
// ==========================================

async function sendRequest(request) {

    addMessage(
        request,
        "user"
    );


    addMessage(
        "💕 Estoy pensando...",
        "bot"
    );


    try {

        const respuesta =
            await hablarConPekets(request);


        const mensajes =
            document.querySelectorAll(
                ".bot-message"
            );


        const ultimo =
            mensajes[mensajes.length - 1];


        ultimo.textContent =
            respuesta;


    } catch (error) {

        console.error(error);

    }
}


// ==========================================
// 🔔 NOTIFICACIONES
// ==========================================

async function activarNotificaciones() {

    try {

        if (
            typeof firebase === "undefined"
        ) {

            alert(
                "Firebase todavía no se ha cargado."
            );

            return;
        }


        const permiso =
            await Notification.requestPermission();


        if (permiso !== "granted") {

            alert(
                "Necesitas permitir las notificaciones ❤️"
            );

            return;
        }


        const registration =
            await navigator.serviceWorker.register(
                "./firebase-messaging-sw.js"
            );


        const messaging =
            firebase.messaging();


        const token =
            await messaging.getToken({

                vapidKey:
                    "BHPdYr2a2ohubzZYYsvKnL_F60wZfVhuI8NHS5CMiInY6Mt39IiEz0aajgh3vVpAzmiTnDbNqBb3OtIGhe3z80U",

                serviceWorkerRegistration:
                    registration
            });


        console.log(
            "TOKEN:",
            token
        );


        alert(
            "🔔 ¡Notificaciones activadas! ❤️"
        );


    } catch (error) {

        console.error(
            "ERROR NOTIFICACIONES:",
            error
        );

        alert(
            "No se han podido activar las notificaciones."
        );
    }
}


// ==========================================
// 🌐 HACEMOS LAS FUNCIONES VISIBLES
// ==========================================

window.sendMessage =
    sendMessage;

window.handleEnter =
    handleEnter;

window.sendRequest =
    sendRequest;

window.activarNotificaciones =
    activarNotificaciones;

window.hablarConPekets =
    hablarConPekets;
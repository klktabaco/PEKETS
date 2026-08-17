import { initializeApp } from "https://cdn.jsdelivr.net/npm/firebase@12.16.0/firebase-app.js";

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend
} from "https://cdn.jsdelivr.net/npm/firebase@12.16.0/firebase-ai.js";


// ==========================================
// FIREBASE
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDIT5zXfsGYNUxe",
    authDomain: "pekets-4f821.firebaseapp.com",
    projectId: "pekets-4f821",
    storageBucket: "pekets-4f821.firebasestorage.app",
    messagingSenderId: "949543833442",
    appId: "1:949543833442:web:973bf89f058020c6e8e63b"
};


// ==========================================
// INICIAR FIREBASE
// ==========================================

const firebaseApp = initializeApp(firebaseConfig);


// ==========================================
// GEMINI
// ==========================================

const ai = getAI(firebaseApp, {
    backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
    model: "gemini-3.5-flash"
});


// ==========================================
// MEMORIA DE PEKETS
// ==========================================

const historial = [];


// ==========================================
// PERSONALIDAD
// ==========================================

const instruccionesPEKETS = `
Eres PEKETS ❤️, una asistente personal.

Tu objetivo es conversar con PEKETS de forma natural,
cariñosa, cercana y divertida.

PERSONALIDAD:

- Hablas siempre en español.
- Llamas a la usuaria PEKETS.
- Eres cariñosa y cercana.
- Puedes utilizar emojis, pero sin abusar.
- No repites siempre las mismas respuestas.
- Mantienes conversaciones naturales.
- Haces preguntas cuando tenga sentido.
- Escuchas lo que PEKETS te cuenta.
- Recuerdas el contexto de la conversación.
- Intentas ayudar siempre que puedas.
- Si PEKETS está triste, eres comprensiva.
- Si está contenta, compartes su entusiasmo.
- Puedes hacer bromas de forma natural.
- No seas excesivamente formal.

IMPORTANTE:

No inventes acciones que no puedes realizar.

No digas que has avisado a Guillem,
que has enviado una notificación,
que has comprado algo,
o que has realizado una acción externa
si realmente no puedes hacerlo.

Si no puedes realizar una acción,
dilo de forma natural.

Tu objetivo es que PEKETS sienta que está
hablando con una asistente personal inteligente,
cariñosa y natural.
`;


// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function addMessage(text, type) {

    const chat = document.getElementById("chat");

    if (!chat) {
        console.error("No existe #chat");
        return;
    }

    const message = document.createElement("div");

    message.classList.add("chat-message");

    if (type === "user") {
        message.classList.add("user-message");
    } else {
        message.classList.add("bot-message");
    }

    message.textContent = text;

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


// ==========================================
// HABLAR CON GEMINI
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

        return "💕 PEKETS, ahora mismo he tenido un pequeño problema. Inténtalo otra vez ❤️";
    }
}


// ==========================================
// ENVIAR MENSAJE
// ==========================================

async function sendMessage() {

    const input =
        document.getElementById("messageInput");


    if (!input) {
        console.error("No existe messageInput");
        return;
    }


    const message =
        input.value.trim();


    if (message === "") {
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


    const mensajes =
        document.querySelectorAll(".bot-message");


    const ultimoMensaje =
        mensajes[mensajes.length - 1];


    try {

        const respuesta =
            await hablarConPekets(message);


        ultimoMensaje.textContent =
            respuesta;


    } catch (error) {

        console.error(error);

        ultimoMensaje.textContent =
            "💕 Ha ocurrido un pequeño problema. Inténtalo otra vez ❤️";
    }
}


// ==========================================
// ENTER
// ==========================================

function handleEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


// ==========================================
// BOTONES
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


    const mensajes =
        document.querySelectorAll(".bot-message");


    const ultimoMensaje =
        mensajes[mensajes.length - 1];


    try {

        const respuesta =
            await hablarConPekets(request);


        ultimoMensaje.textContent =
            respuesta;


    } catch (error) {

        console.error(error);

        ultimoMensaje.textContent =
            "💕 Ha ocurrido un pequeño problema. Inténtalo otra vez ❤️";
    }
}


// ==========================================
// NOTIFICACIONES
// ==========================================

async function activarNotificaciones() {

    try {

        if (!("Notification" in window)) {

            alert(
                "Este navegador no permite notificaciones."
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
            window.firebase.messaging();


        const token =
            await messaging.getToken({

                vapidKey:
                    "BHPdYr2a2ohubzZYYsvKnL_F60wZfVhuI8NHS5CMiInY6Mt39IiEz0aajgh3vVpAzmiTnDbNqBb3OtIGhe3z80U",

                serviceWorkerRegistration:
                    registration
            });


        console.log(
            "TOKEN DE PEKETS:",
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
// HACER FUNCIONES DISPONIBLES PARA HTML
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


console.log(
    "❤️ PEKETS AI CARGADA CORRECTAMENTE"
);
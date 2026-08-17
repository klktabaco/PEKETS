import { hablarConPekets } from "./ai.js";

const chat = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");

let requests = [];

function addMessage(text, type) {

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


function createRequest(title, description, emoji) {

    const request = {

        id: Date.now(),

        title: title,

        description: description,

        emoji: emoji,

        status: "Pendiente",

        date: new Date().toLocaleString()

    };

    requests.push(request);

    console.log("🔔 NUEVA SOLICITUD:", request);

    addMessage(
        `🔔 He avisado a Guillem: ${emoji} ${title} ❤️`,
        "bot"
    );
}


async function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    addMessage(message, "user");

    messageInput.value = "";

    addMessage(
        "💕 Estoy pensando...",
        "bot"
    );

    try {

        const respuesta = await hablarConPekets(message);

        const mensajes = document.querySelectorAll(".bot-message");

        if (mensajes.length > 0) {
            mensajes[mensajes.length - 1].textContent = respuesta;
        }

    } catch (error) {

        console.error("Error hablando con Gemini:", error);

        const mensajes = document.querySelectorAll(".bot-message");

        if (mensajes.length > 0) {
            mensajes[mensajes.length - 1].textContent =
                "💕 Uy PEKETS, he tenido un pequeño problema. Inténtalo otra vez ❤️";
        }
    }
}


function handleEnter(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

}


function sendRequest(request) {

    addMessage(request, "user");

    setTimeout(async () => {

        try {

            const respuesta = await hablarConPekets(request);

            addMessage(respuesta, "bot");

        } catch (error) {

            console.error(error);

            addMessage(
                "💕 Ha ocurrido un pequeño problema, PEKETS ❤️",
                "bot"
            );
        }

    }, 300);
}


// =====================================================
// NOTIFICACIONES
// =====================================================

async function activarNotificaciones() {

    try {

        const permiso =
            await Notification.requestPermission();

        if (permiso !== "granted") {

            alert(
                "PEKETS necesita permiso para enviarte notificaciones ❤️"
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

        if (token) {

            console.log(
                "✅ PEKETS está registrado para recibir notificaciones."
            );

            console.log(
                "TOKEN:",
                token
            );

            alert(
                "🔔 ¡Notificaciones activadas! ❤️"
            );

        }

    } catch (error) {

        console.error(
            "Error activando notificaciones:",
            error
        );

        alert(
            "Ha ocurrido un error al activar las notificaciones."
        );
    }
}
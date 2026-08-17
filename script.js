const chat = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");


// ===============================
// MOSTRAR MENSAJES
// ===============================

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


// ===============================
// ENVIAR MENSAJE
// ===============================

async function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    addMessage(message, "user");

    messageInput.value = "";

    addMessage("💕 Estoy pensando...", "bot");

    const mensajes = document.querySelectorAll(".bot-message");
    const ultimoMensaje = mensajes[mensajes.length - 1];

    try {

        if (typeof window.hablarConPekets === "function") {

            const respuesta =
                await window.hablarConPekets(message);

            ultimoMensaje.textContent = respuesta;

        } else {

            ultimoMensaje.textContent =
                "💕 PEKETS está iniciándose...";

        }

    } catch (error) {

        console.error("Error:", error);

        ultimoMensaje.textContent =
            "💕 Ha ocurrido un pequeño problema ❤️";
    }
}


// ===============================
// ENTER
// ===============================

function handleEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


// ===============================
// BOTONES
// ===============================

async function sendRequest(request) {

    addMessage(request, "user");

    addMessage("💕 Estoy pensando...", "bot");

    const mensajes =
        document.querySelectorAll(".bot-message");

    const ultimoMensaje =
        mensajes[mensajes.length - 1];

    try {

        if (typeof window.hablarConPekets === "function") {

            const respuesta =
                await window.hablarConPekets(request);

            ultimoMensaje.textContent = respuesta;

        } else {

            // Respuestas provisionales
            // para que los botones funcionen aunque Gemini falle

            if (request === "Tengo hambre") {

                ultimoMensaje.textContent =
                    "🍔 Vale PEKETS ❤️ ¿Qué te apetece comer?";

            } else if (request === "Tengo la regla") {

                ultimoMensaje.textContent =
                    "❤️ Vale PEKETS. ¿Quieres mimos, chocolate o que hablemos un rato?";

            } else if (request === "Necesito cuidados") {

                ultimoMensaje.textContent =
                    "🫶 Claro PEKETS. Cuéntame qué necesitas.";

            } else if (request === "Necesito mimos") {

                ultimoMensaje.textContent =
                    "❤️ Ven aquí PEKETS, te mando muchos mimos.";

            }

        }

    } catch (error) {

        console.error("Error:", error);

        ultimoMensaje.textContent =
            "💕 Ha ocurrido un pequeño problema ❤️";
    }
}


// ===============================
// NOTIFICACIONES
// ===============================

async function activarNotificaciones() {

    if (!("Notification" in window)) {

        alert(
            "Este navegador no permite notificaciones."
        );

        return;
    }

    try {

        const permiso =
            await Notification.requestPermission();

        if (permiso === "granted") {

            alert(
                "🔔 ¡Notificaciones activadas! ❤️"
            );

        } else {

            alert(
                "🔔 Necesitas permitir las notificaciones."
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "No se han podido activar las notificaciones."
        );
    }
}


// ===============================
// HACER FUNCIONES VISIBLES PARA HTML
// ===============================

window.sendMessage = sendMessage;

window.handleEnter = handleEnter;

window.sendRequest = sendRequest;

window.activarNotificaciones =
    activarNotificaciones;


console.log("✅ script.js cargado correctamente");
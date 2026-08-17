// ==========================================
// 💕 PEKETS - SCRIPT PRINCIPAL
// ==========================================

const chat = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");

let requests = [];


// ==========================================
// 💬 AÑADIR MENSAJE AL CHAT
// ==========================================

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


// ==========================================
// 🔔 CREAR SOLICITUD PARA GUILLEM
// ==========================================

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
        `🔔 Solicitud creada: ${emoji} ${title}.`,
        "bot"
    );
}


// ==========================================
// 🤖 ENVIAR MENSAJE A PEKETS
// ==========================================

async function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    // Mostrar mensaje de PEKETS
    addMessage(message, "user");

    // Limpiar caja
    messageInput.value = "";

    try {

        // Esperamos a que la IA responda
        const respuesta = await window.hablarConPekets(message);

        // Mostrar respuesta
        addMessage(respuesta, "bot");

    } catch (error) {

        console.error("❌ Error hablando con PEKETS:", error);

        addMessage(
            "💕 Uy PEKETS, he tenido un pequeño problema. Inténtalo otra vez ❤️",
            "bot"
        );
    }
}


// ==========================================
// ⌨️ ENVIAR CON ENTER
// ==========================================

function handleEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


// ==========================================
// ❤️ BOTONES RÁPIDOS
// ==========================================

function sendRequest(request) {

    addMessage(request, "user");

    setTimeout(() => {

        let response = "";

        if (request === "Tengo hambre") {

            response =
                "🍔 Vale PEKETS ❤️ ¿Qué te apetece comer? ¿Pizza, sushi, hamburguesa o alguna otra cosa?";

        }

        else if (request === "Tengo la regla") {

            response =
                "🩸❤️ Vale PEKETS. ¿Necesitas mimos, algo dulce, un masaje o simplemente que te haga compañía?";

        }

        else if (request === "Necesito cuidados") {

            response =
                "🥰 Claro PEKETS. Cuéntame qué necesitas y vemos cómo puedo ayudarte ❤️";

        }

        else if (request === "Necesito mimos") {

            createRequest(
                "Necesita mimos",
                "PEKETS ha indicado que necesita mimos ❤️",
                "❤️"
            );

            return;
        }

        else {

            response =
                "💕 Cuéntame qué necesitas, PEKETS.";

        }

        addMessage(response, "bot");

    }, 300);
}


// ==========================================
// 🔔 FIREBASE - NOTIFICACIONES
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDIT5zXfsGYNUexGUVAzD9bhTemeoq1A",

    authDomain: "pekets-4f821.firebaseapp.com",

    projectId: "pekets-4f821",

    storageBucket: "pekets-4f821.firebasestorage.app",

    messagingSenderId: "949543833442",

    appId: "1:949543833442:web:973bf89f058020c6e8e63b"
};


// Inicializar Firebase

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


// ==========================================
// 🔔 ACTIVAR NOTIFICACIONES
// ==========================================

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

            console.log("TOKEN:", token);

            alert(
                "🔔 ¡Notificaciones activadas! ❤️"
            );

        }

        else {

            console.log(
                "❌ No se ha podido obtener el token."
            );

        }

    }

    catch (error) {

        console.error(
            "❌ Error activando notificaciones:",
            error
        );

        alert(
            "Ha ocurrido un error al activar las notificaciones."
        );
    }
}
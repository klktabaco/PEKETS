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

    console.log("NUEVA SOLICITUD:", request);

    addMessage(
        `🔔 Solicitud creada: ${emoji} ${title}. Guillem recibirá esta petición.`,
        "bot"
    );
}

function sendMessage() {

    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    addMessage(message, "user");

    messageInput.value = "";

    setTimeout(() => {

        const response = getResponse(message);

        addMessage(response, "bot");

    }, 500);
}

function handleEnter(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

}

function sendRequest(request) {

    addMessage(request, "user");

    setTimeout(() => {

        let response = "";

        if (request === "Tengo hambre") {

            response = "🍔 Vale PEKETS ❤️ ¿Qué te apetece? ¿McDonald's, pizza, sushi o alguna otra cosa?";

        } else if (request === "Tengo la regla") {

            response = "🩸❤️ Vale PEKETS. ¿Quieres algo dulce, mimos, un masaje o que avise a Guillem?";

        } else if (request === "Me duele la espalda") {

            response = "💆❤️ ¿Quieres que avise a Guillem para que te haga un masaje?";

        } else if (request === "Necesito mimos") {

            createRequest(
                "Necesita mimos",
                "PEKETS ha indicado que necesita mimos ❤️",
                "❤️"
            );

            return;
        }

        addMessage(response, "bot");

    }, 500);
}

function getResponse(message) {

    const text = message.toLowerCase();

    if (text.includes("kinder")) {

        createRequest(
            "Kinder Bueno",
            "PEKETS quiere un Kinder Bueno 🥺",
            "🍫"
        );

        return "🍫 He creado una solicitud para Guillem. Porfi 🥺";

    }

    if (text.includes("chocolate")) {

        createRequest(
            "Chocolate",
            "PEKETS quiere algo de chocolate.",
            "🍫"
        );

        return "🍫 Solicitud creada. Guillem se enterará ❤️";

    }

    if (text.includes("hambre")) {

        return "🍔 Tengo una idea... ¿Qué te apetece comer?";

    }

    if (text.includes("masaje") || text.includes("espalda")) {

        createRequest(
            "Masaje",
            "PEKETS quiere un masaje porque le duele la espalda.",
            "💆"
        );

        return "💆 He avisado a Guillem. Espero que te cuide mucho ❤️";

    }

    if (text.includes("regla")) {

        return "🩸❤️ Tranquila PEKETS. ¿Necesitas chocolate, mimos, un masaje o algo más?";

    }

    if (text.includes("mimos")) {

        createRequest(
            "Mimos",
            "PEKETS necesita mimos ❤️",
            "❤️"
        );

        return "❤️ Solicitud enviada a Guillem.";

    }

    return "💕 Te entiendo, PEKETS. Cuéntame un poco más qué necesitas.";

}

// ================================
// 🔔 NOTIFICACIONES DE PEKETS
// ================================

const firebaseConfig = {
    apiKey: "AIzaSyDIT5zXfsGYNUxepsGUVAzD9bhTemeoq1A",
    authDomain: "pekets-4f821.firebaseapp.com",
    projectId: "pekets-4f821",
    storageBucket: "pekets-4f821.firebasestorage.app",
    messagingSenderId: "949543833442",
    appId: "1:949543833442:web:973bf89f058020c6e8e63b"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

async function activarNotificaciones() {

    try {

        const permiso = await Notification.requestPermission();

        if (permiso !== "granted") {
            alert("PEKETS necesita permiso para enviarte notificaciones ❤️");
            return;
        }

        const registration = await navigator.serviceWorker.register(
            "./firebase-messaging-sw.js"
        );

        const token = await messaging.getToken({
            vapidKey: "BHPdYr2a2ohubzZYYsvKnL_F60wZfVhuI8NHS5CMiInY6Mt39IiEz0aajgh3vVpAzmiTnDbNqBb3OtIGhe3z80U",
            serviceWorkerRegistration: registration
        });

        if (token) {

            console.log("✅ PEKETS está registrado para recibir notificaciones.");
            console.log("TOKEN:", token);

            alert("🔔 ¡Notificaciones activadas! ❤️");

        } else {

            console.log("No se ha podido obtener el token.");

        }

    } catch (error) {

        console.error("Error activando notificaciones:", error);

        alert("Ha ocurrido un error al activar las notificaciones.");

    }
}
// ==========================================
// 💕 PEKETS - SCRIPT PRINCIPAL
// ==========================================

const chat = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");

let requests = [];


// ==========================================
// 💬 AÑADIR MENSAJE
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
// 🔔 CREAR SOLICITUD
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

    console.log(
        "🔔 NUEVA SOLICITUD:",
        request
    );

    addMessage(
        `🔔 Solicitud creada: ${emoji} ${title}.`,
        "bot"
    );
}


// ==========================================
// 🤖 ENVIAR MENSAJE
// ==========================================

async function sendMessage() {

    const message =
        messageInput.value.trim();


    if (message === "") {
        return;
    }


    addMessage(
        message,
        "user"
    );


    messageInput.value = "";


    try {

        if (
            typeof window.hablarConPekets !==
            "function"
        ) {

            throw new Error(
                "La IA todavía no está cargada."
            );
        }


        const respuesta =
            await window.hablarConPekets(
                message
            );


        addMessage(
            respuesta,
            "bot"
        );


    } catch (error) {

        console.error(
            "❌ Error:",
            error
        );


        addMessage(
            "💕 PEKETS, estoy teniendo un problema para conectarme con mi IA. ❤️",
            "bot"
        );
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
// ❤️ BOTONES RÁPIDOS
// ==========================================

function sendRequest(request) {

    addMessage(
        request,
        "user"
    );


    setTimeout(async () => {

        try {

            if (
                typeof window.hablarConPekets ===
                "function"
            ) {

                const respuesta =
                    await window.hablarConPekets(
                        request
                    );

                addMessage(
                    respuesta,
                    "bot"
                );

            } else {

                addMessage(
                    "💕 Espera un momento PEKETS, estoy iniciándome.",
                    "bot"
                );
            }

        } catch (error) {

            console.error(
                "❌ Error:",
                error
            );

            addMessage(
                "💕 Uy PEKETS, he tenido un pequeño problema ❤️",
                "bot"
            );
        }

    }, 200);
}


// ==========================================
// 🔔 FIREBASE NOTIFICACIONES
// ==========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyDIT5zXfsGYNUexGUVAzD9bhTemeoq1A",

    authDomain:
        "pekets-4f821.firebaseapp.com",

    projectId:
        "pekets-4f821",

    storageBucket:
        "pekets-4f821.firebasestorage.app",

    messagingSenderId:
        "949543833442",

    appId:
        "1:949543833442:web:973bf89f058020c6e8e63b"
};


firebase.initializeApp(
    firebaseConfig
);

const messaging =
    firebase.messaging();


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
                "✅ Notificaciones activadas"
            );

            console.log(
                "TOKEN:",
                token
            );

            alert(
                "🔔 ¡Notificaciones activadas! ❤️"
            );

        } else {

            console.log(
                "❌ No se pudo obtener el token."
            );
        }


    } catch (error) {

        console.error(
            "❌ Error activando notificaciones:",
            error
        );

        alert(
            "Ha ocurrido un error al activar las notificaciones."
        );
    }
}
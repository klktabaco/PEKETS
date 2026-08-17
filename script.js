// ==========================================
// CHAT
// ==========================================

const chat =
    document.getElementById("chat");

const messageInput =
    document.getElementById("messageInput");


// ==========================================
// MOSTRAR MENSAJE
// ==========================================

function addMessage(text, type) {

    const message =
        document.createElement("div");


    message.classList.add(
        "chat-message"
    );


    if (type === "user") {

        message.classList.add(
            "user-message"
        );

    } else {

        message.classList.add(
            "bot-message"
        );

    }


    message.textContent =
        text;


    chat.appendChild(
        message
    );


    chat.scrollTop =
        chat.scrollHeight;
}


// ==========================================
// ENVIAR MENSAJE
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


    addMessage(
        "💕 Estoy pensando...",
        "bot"
    );


    try {

        const respuesta =
            await window.hablarConPekets(
                message
            );


        const mensajes =
            document.querySelectorAll(
                ".bot-message"
            );


        const ultimo =
            mensajes[
                mensajes.length - 1
            ];


        ultimo.textContent =
            respuesta;


    } catch (error) {

        console.error(
            "Error hablando con PEKETS:",
            error
        );


        const mensajes =
            document.querySelectorAll(
                ".bot-message"
            );


        const ultimo =
            mensajes[
                mensajes.length - 1
            ];


        ultimo.textContent =
            "💕 Uy PEKETS, ha ocurrido un pequeño problema ❤️";

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


    try {

        const respuesta =
            await window.hablarConPekets(
                request
            );


        const mensajes =
            document.querySelectorAll(
                ".bot-message"
            );


        const ultimo =
            mensajes[
                mensajes.length - 1
            ];


        ultimo.textContent =
            respuesta;


    } catch (error) {

        console.error(
            "Error:",
            error
        );

    }

}


// ==========================================
// NOTIFICACIONES
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDIT5zXfsGYNUxepsGUVAzD9bhTemeoq1A",

    authDomain: "pekets-4f821.firebaseapp.com",

    projectId: "pekets-4f821",

    storageBucket: "pekets-4f821.firebasestorage.app",

    messagingSenderId: "949543833442",

    appId: "1:949543833442:web:973bf89f058020c6e8e63b"

};


firebase.initializeApp(
    firebaseConfig
);


const messaging =
    firebase.messaging();


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
                "TOKEN:",
                token
            );


            alert(
                "🔔 ¡Notificaciones activadas! ❤️"
            );

        } else {

            console.log(
                "No se ha podido obtener el token."
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


// ==========================================
// FUNCIONES PARA HTML
// ==========================================

window.sendMessage =
    sendMessage;

window.handleEnter =
    handleEnter;

window.sendRequest =
    sendRequest;

window.activarNotificaciones =
    activarNotificaciones;
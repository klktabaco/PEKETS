importScripts(
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDIT5zXfsGYNUxepsGUVAzD9bhTemeoq1A",
  authDomain: "pekets-4f821.firebaseapp.com",
  projectId: "pekets-4f821",
  storageBucket: "pekets-4f821.firebasestorage.app",
  messagingSenderId: "949543833442",
  appId: "1:949543833442:web:973bf89f058020c6e8e63b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  console.log("Notificación recibida:", payload);

  const title = payload.notification?.title || "PEKETS ❤️";

  const options = {
    body: payload.notification?.body || "Tienes una nueva solicitud 💕",
    icon: "./icon.png"
  };

  self.registration.showNotification(title, options);

});
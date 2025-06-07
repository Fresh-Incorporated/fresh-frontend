self.addEventListener('push', function (event) {
    console.log(event)
    if (!event.data) return;

    const payload = event.data.json();
    const title = payload.title || "Уведомление";
    const options = payload.options || {
        body: "Нет содержимого"
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
});


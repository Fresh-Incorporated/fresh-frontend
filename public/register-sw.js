if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/sw.js')
        .then(swReg => {
            console.log('Service Worker зарегистрирован:', swReg);
        });
}

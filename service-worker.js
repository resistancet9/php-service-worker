self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
      return;
  }

  const sendNotification = body => {
      // you could refresh a notification badge here with postMessage API
      var resp = JSON.parse(body);
      return self.registration.showNotification(resp.title, resp.options);
  };

  if (event.data) {
      const message = event.data.text();
      event.waitUntil(sendNotification(message));
  }
});


self.addEventListener('notificationclick', function(event) {
  var url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
  event.notification.close();
});
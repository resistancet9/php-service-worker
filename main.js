document.addEventListener('DOMContentLoaded', function() {
      var send = document.getElementById("send");
      var applicationServerKey = "BCmti7ScwxxVAlB7WAyxoOXtV7J8vVCXwEDIFXjKvD-ma-yJx_eHJLdADyyzzTKRGb395bSAtxlh4wuDycO3Ih4";

      function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }

      Notification.requestPermission(function(res) {
        if (res === 'granted') {
          navigator.serviceWorker.register("service-worker.js")
            .then(() => {
              console.log('[SW] Service worker has been registered');
              subscribe();
            }, e => {
              console.error('[SW] Service worker registration failed', e);
            });
        }

      })

      function subscribe() {
        navigator.serviceWorker.ready.then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
          .then(subscription => {
            if (!subscription) {
              navigator.serviceWorker.ready
                .then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
                }))
                .then(subscription => {
                  // send to server
                  const key = subscription.getKey('p256dh');
                  const token = subscription.getKey('auth');

                  return fetch('storeInDb.php', {
                    method: "POST",
                    body: JSON.stringify({
                      endpoint: subscription.endpoint,
                      key: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
                      token: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null
                    }),
                  }).then(() => subscription);

                })
                .catch(e => {
                  if (Notification.permission === 'denied') {
                    console.warn('Notifications are denied by the user.');
                  } else {
                    console.error('Impossible to subscribe to push notifications', e);
                  }
                });
            } else {
              console.log("already subbed to", subscription.endpoint);
            }
          })

      } // sub function

      function notify() {
        navigator.serviceWorker.ready.then(serviceWorkerRegistration => serviceWorkerRegistration.pushManager.getSubscription())
          .then(subscription => {
              const token = subscription.getKey('auth');
              return fetch('push.php', {
                method: "POST",
                header: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  token: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null
                }),
              })
            })
            .catch((err)=>{
              if(Notification.permission === 'denied')
                console.log("Notifications blocked by user");
              else
                console.log(err)
            })
          } // notify function

        send.addEventListener('click', function(e) {
          notify();
        })


      }) // on load

document.addEventListener('DOMContentLoaded',function(){
  var enable = document.getElementById("enable");
  var send = document.getElementById("send");

  enable.addEventListener('click', function(e){
    Notification.requestPermission(function(res){
      if(res === 'granted'){
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
          });

          fetch('push.php', {
            headers: {
              "Accept": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ name: "Naveen"}),
        }).then((e)=> {return e.json()}).then((f)=>{console.log(f)})
        }
      }
    })
  })

  send.addEventListener('click', function(e){
    console.log("send!")
  })

})
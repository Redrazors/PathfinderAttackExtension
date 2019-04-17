document.addEventListener('DOMContentLoaded', function () {
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
      (function () {
          var ln = links[i];
          var location = ln.href;
          ln.onclick = function () {
              chrome.tabs.create({active: true, url: location});
          };
      })();
  }
  
  restore_options();
  document.getElementById("checkD20pfsrd").addEventListener('click', save_options);
});


function save_options() {
  var d20pfsrd = document.getElementById('checkD20pfsrd').checked;
  chrome.storage.sync.set({
    d20pfsrd: d20pfsrd
  }, function() {
    setTimeout(function() {   
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
      d20pfsrd: true
  }, function(items) {
    document.getElementById('checkD20pfsrd').checked = items.d20pfsrd;   
  });
}




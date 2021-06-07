let submitButton = document.getElementById("setKeyButton");
let enabledButton = document.getElementById("enabledButton");

window.onload = function () {
  chrome.storage.sync.get(['apiKey'], function (result) {
    document.getElementById("apiKey").value = result.apiKey;
  });
  chrome.storage.sync.get('enabled', function (result) {
    if (result.enabled) {
      enabledButton.classList.add("btn-danger");
      enabledButton.classList.remove("btn-success");
      enabledButton.innerHTML = 'Turn Off';
    } else {
      enabledButton.classList.add("btn-success");
      enabledButton.classList.remove("btn-danger");
      enabledButton.innerHTML = 'Turn On';
    }
  });
};

submitButton.addEventListener("click", async () => {
  let key = document.getElementById("apiKey").value;
  chrome.storage.sync.set({ apikey: key }, function (result) {
    console.log("key set");
    console.log(key);
  });
});

enabledButton.addEventListener("click", async () => {
  chrome.storage.sync.get('enabled', function (result) {
    if (result.enabled) {
      chrome.storage.sync.set({ enabled: false }, function (result) {
        enabledButton.classList.add("btn-success");
        enabledButton.classList.remove("btn-danger");
        enabledButton.innerHTML = 'Turn On'
      });
    } else {
      chrome.storage.sync.set({ enabled: true }, function (result) {
        enabledButton.classList.add("btn-danger");
        enabledButton.classList.remove("btn-success");
        enabledButton.innerHTML = 'Turn Off'
      });
    }
  });
});
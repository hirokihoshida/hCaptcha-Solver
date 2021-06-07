let submitButton = document.getElementById("setKeyButton");
let enabledButton = document.getElementById("enabledButton");

window.onload = function () {
  //set 2captcha api textbox with storage value
  chrome.storage.sync.get(['apiKey'], function (result) {
    if (result.apiKey) {
      document.getElementById("apiKey").value = result.apiKey;
    }
  });
  //if enabled, turn button red
  //if disabled, turn button green
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

//when api set button clicked
submitButton.addEventListener("click", async () => {
  let key = document.getElementById("apiKey").value;
  chrome.storage.sync.set({ apikey: key }, function (result) {
    console.log("2Captcha API Key Set.");
    console.log(key);
  });
});

//when on/off button clicked
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
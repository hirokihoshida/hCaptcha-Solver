chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action == "send") {
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
      url = "http://2captcha.com/in.php?key=";
      sitekey = request.sitekey;
      pageurl = sender.tab.url;
      chrome.storage.sync.get(["apikey"], function (result) {
        apikey = result.apikey;
        console.log(apikey);
        url = url + apikey + "&method=hcaptcha&sitekey=" + sitekey + "&pageurl=" + pageurl;
        console.log(url)
        fetch(url).then(r => r.text()).then(result => {
          sendResponse({ status: result });
        })
      });
      return true;
    }
    if (request.action == "get") {
      console.log("getting answer")
      console.log(request.sitekey)
      console.log(request.solveid)
      url = "http://2captcha.com/res.php?key="
      solveid = request.solveid;
      chrome.storage.sync.get(["apikey"], function (result) {
        apikey = result.apikey;
        url = url + apikey + "&action=get&id=" + solveid;
        fetch(url).then(r => r.text()).then(result => {
          if (result == "ERROR_WRONG_USER_KEY") {
            sendResponse({ status: 'badkey' });
          } else if (result == "CAPCHA_NOT_READY") {
            sendResponse({ status: 'notready' });
          } else {
            sendResponse({ status: result });
          };
        });
      });
      return true;
    }
    return true;
  }
);
//listen to messages from content script (solver.js)
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    //if message is sending new captcha
    if (request.action == "send") {
      //build url for GET
      url = "http://2captcha.com/in.php?key=";
      sitekey = request.sitekey;
      pageurl = sender.tab.url;
      chrome.storage.sync.get(["apikey"], function (result) {
        apikey = result.apikey;
        url = url + apikey + "&method=hcaptcha&sitekey=" + sitekey + "&pageurl=" + pageurl;
        fetch(url).then(r => r.text()).then(result => {
          //send OK or error response
          sendResponse({ status: result });
        })
      });
      return true;
    }
    //if message is requesting solution for a captcha
    if (request.action == "get") {
      //build url for GET
      url = "http://2captcha.com/res.php?key="
      solveid = request.solveid;
      chrome.storage.sync.get(["apikey"], function (result) {
        apikey = result.apikey;
        url = url + apikey + "&action=get&id=" + solveid;
        fetch(url).then(r => r.text()).then(result => {
          //send status of captcha solution (wrong key, not ready, or solution)
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
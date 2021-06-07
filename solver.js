function solveCaptcha() {
    hcapframe = document.querySelector("[title*='hCaptcha security challenge']");
    captcha = document.getElementsByClassName("h-captcha")[0];
    sitekey = captcha.getAttribute("data-sitekey");
    hcapframe.insertAdjacentHTML("afterend", "<p id='hCapStatus'>Solving...</p>");
    chrome.runtime.sendMessage({ sitekey: sitekey, action: "send" }, function (response) {
        if (response.status == "ERROR_WRONG_USER_KEY") {
            alert("Invalid 2Captcha Key.");
        } else {
            var solveid = response.status.split('|')[1];
            console.log(solveid)
            solveinterval = setInterval(function () {
                chrome.runtime.sendMessage({ sitekey: sitekey, solveid: solveid, action: "get" }, function (response) {
                    if (response.status == "notready") {
                        console.log("hCaptcha solution not ready...");
                    } else if (response.status == "badkey") {
                        clearInterval(solveinterval);
                    } else {
                        console.log("hCaptcha solved!")
                        solution = response.status.split('|')[1];
                        clearInterval(solveinterval);
                        document.getElementById("hCapStatus").innerHTML = "Solved!";
                        document.querySelector("[id*='h-captcha-response']").value = solution;
                        document.querySelector("[id*='g-recaptcha-response']").value = solution;

                    };
                });
            }, 2000);
        };
    });
};

attempts = 0;
findcaptchainterval = setInterval(findcaptcha, 1000)

function findcaptcha() {
    chrome.storage.sync.get('enabled', function (result) {
        if (result.enabled){
            hcapframe = document.querySelector("[title*='hCaptcha security challenge']");
            if (hcapframe) {
                console.log("hCaptcha detected!");
                clearInterval(findcaptchainterval);
                solveCaptcha();
            } else {
                attempts++;
            }
            if (attempts == 10) {
                console.log("hCaptcha search timed out.");
                clearInterval(findcaptchainterval);
            }
        } else{
            console.log("hCaptcha solver extension not enabled");
            clearInterval(findcaptchainterval);
        }
    });
    
}
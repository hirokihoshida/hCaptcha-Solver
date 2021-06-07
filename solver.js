//main solving code
function solveCaptcha() {
    //hcaptcha box
    hcapframe = document.querySelector("[title*='hCaptcha security challenge']");
    //get captcha sitekey (id of captcha)
    captcha = document.getElementsByClassName("h-captcha")[0];
    sitekey = captcha.getAttribute("data-sitekey");
    //insert solving./. message
    hcapframe.insertAdjacentHTML("afterend", "<p id='hCapStatus'>Solving...</p>");
    //send messge to background script to start solving
    chrome.runtime.sendMessage({ sitekey: sitekey, action: "send" }, function (response) {
        //if wrong key
        if (response.status == "ERROR_WRONG_USER_KEY") {
            alert("Invalid 2Captcha Key.");
        } else {
            //get captcha id from 2captcha
            var solveid = response.status.split('|')[1];
            //repeat every 2 seconds until solution is found or error is returned
            solveinterval = setInterval(function () {
                //send message to get solution for captcha
                chrome.runtime.sendMessage({ sitekey: sitekey, solveid: solveid, action: "get" }, function (response) {
                    if (response.status == "notready") {
                        console.log("hCaptcha solution not ready...");
                    } else if (response.status == "badkey") {
                        clearInterval(solveinterval);
                    } else {
                        //if solved, set hidden textbox values with solution
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

//upon loading of page
attempts = 0;
findcaptchainterval = setInterval(findcaptcha, 1000)

//look for hcaptcha function once every second for 10 seconds for late loads
function findcaptcha() {
    //if extension is enabled
    chrome.storage.sync.get('enabled', function (result) { 
        if (result.enabled){
            //look for hcaptcha
            hcapframe = document.querySelector("[title*='hCaptcha security challenge']");
            if (hcapframe) {
                //start function if hcaptcha is found
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
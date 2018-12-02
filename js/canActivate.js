$(document).ready(() => {
    $("#loading").show(1000);
    $(".user-form").hide();
    let currentUrl = window.location.pathname.split('/');
    if (window.localStorage.getItem('username') && window.localStorage.getItem('token')){
        canActivate();
    }
    else {
        if (currentUrl[currentUrl.length - 1] === 'login.html' || currentUrl[currentUrl.length - 1] === 'register.html') {
            $("#loading").hide(1000);
            $(".user-form").show(1000);
        }
        else
            window.location.assign('login.html');
    }
});


function canActivate() {
    let currentUrl = window.location.pathname.split('/');
    setTimeout(() => {
        let xhttp = new XMLHttpRequest(), method = "POST", url = "http://localhost:3000/calendar";
        xhttp.open(method, url);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");

        let userDetails = JSON.stringify({
            username: window.localStorage.getItem('username'),
            token: window.localStorage.getItem('token'),
        });

        xhttp.send(userDetails);

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                let response = JSON.parse(xhttp.responseText);
                if (response) {
                    if (response.success === "true") {
                        if (currentUrl[currentUrl.length - 1] === 'login.html' || currentUrl[currentUrl.length - 1] === 'register.html')
                            window.location.assign('index.html');
                        toastr["success"](response.message);
                    }
                    else {
                        console.log(response);
                        alert(response);
                        if (currentUrl[currentUrl.length - 1] !== 'login.html' && currentUrl[currentUrl.length - 1] !== 'register.html'){
                            window.location.assign('login.html');

                        }
                        else {
                            $("#loading").hide(1000);
                            $(".user-form").show(1000);
                        }
                    }
                }
                else {
                    if (currentUrl[currentUrl.length - 1] !== 'login.html' && currentUrl[currentUrl.length - 1] !== 'register.html') {
                        window.location.assign('login.html');
                    }
                    else
                        toastr["error"]('ארעה שגיאה');
                }
            }
        };
    },500);
}

$(document).ready(() => {
    $("#loading").show(1000);
    $(".user-form").hide();
    let currentUrl = window.location.pathname.split('/');
    if (window.localStorage.getItem('username') && window.localStorage.getItem('token')) {
        canActivate().then(res => {
            if (res.success === 'true') {
                setTimeout(() => {
                    if (currentUrl[currentUrl.length - 1] === 'login.html' || currentUrl[currentUrl.length - 1] === 'register.html')
                        window.location.assign('index.html');
                    else {
                        toastr["success"](res.message);
                        loadCalendar();
                    }
                }, 2000);
            }
            else {
                if (currentUrl[currentUrl.length - 1] !== 'login.html' && currentUrl[currentUrl.length - 1] !== 'register.html')
                    window.location.assign('login.html');
                else
                    $("#loading").hide(1000);
                $(".user-form").show(1000);
            }
        })
            .catch(() => toastr["error"]('אין גישה לשרת'));
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
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/calendar");
    xhttp.setRequestHeader("Content-Type", "application/json");

    return new Promise((resolve, reject) => {
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200)
                    resolve(JSON.parse(xhttp.responseText));
                reject(null);
            }
        };
        xhttp.send(JSON.stringify({
            username: window.localStorage.getItem('username'),
            token: window.localStorage.getItem('token')
        }));
    });
}

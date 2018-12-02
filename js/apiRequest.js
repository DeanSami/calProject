$(document).ready(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "rtl": true
    };
});

function login(username, password) {
    if (username === '' || password === '')
        toastr["error"]('יש למלא את כל השדות');
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/login");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.send(JSON.stringify({
            username: username,
            password: password
        }));

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    let response = JSON.parse(xhttp.responseText);
                    if (response) {
                        if (response.success === "true") {
                            setTimeout(() => window.location.assign('index.html')
                                , 2000);
                            window.localStorage.setItem('username', response.username);
                            window.localStorage.setItem('token', response.token);
                            toastr["success"](response.message);
                        }
                        else {
                            toastr["error"](response.message);
                        }
                    }
                }
                else
                    toastr["error"]('ארעה שגיאה');
            }
        }
    }
}

function register(data) {
    if (data === undefined)
        toastr["error"]('יש למלא את כל השדות');
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/register");
        xhttp.setRequestHeader("Content-Type", "application/json");

        xhttp.send(JSON.stringify({
            username: data.username,
            password: data.password,
            password2: data.password2
        }));

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    let response = JSON.parse(xhttp.responseText);
                    if (response) {
                        let response = JSON.parse(xhttp.responseText);
                        if (response) {
                            if (response.success === "true") {
                                setTimeout(() => window.location.assign('index.html'), 2000);
                                // window.localStorage.setItem('username',response.username);
                                // window.localStorage.setItem('token',response.token);
                                toastr["success"](response.message);
                            }
                            else {
                                toastr["error"](response.message);
                            }
                        }
                    }
                }
                else
                    toastr["error"]('ארעה שגיאה');
            }
        }
    }
}

function getUserEvents() {
    if (!window.localStorage.getItem('username')) {
        toastr["error"]('ארעה שגיאה');
        return null;
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/calendar");
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve,reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(xhttp.responseText);
                    reject();
                }
            };
            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token'),
            }));
        });
    }
}

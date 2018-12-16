$(document).ready(function () {
    $('#submit_form').prop('disabled', true);
});

function login(username, password) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/login");
        xhttp.setRequestHeader("Content-Type", "application/json");

        new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(JSON.parse(xhttp.responseText));
                    reject(null);
                }
            };
            xhttp.send(JSON.stringify({
                username: username,
                password: password
            }));
        }).then(res => {
            if (res.success === 'true') {
                window.localStorage.setItem('username', res.username);
                window.localStorage.setItem('token', res.token);
                toastr["success"](res.message);
                window.location.assign('index.html')
            }
            else {
                toastr["error"](res.message);
            }
        }).catch(() => toastr["error"]('אין גישה לשרת'));
}

function register(data) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/register");
        xhttp.setRequestHeader("Content-Type", "application/json");

        new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(JSON.parse(xhttp.responseText));
                    reject(null);
                }
            };
            xhttp.send(JSON.stringify({
                fullname: data.fullname,
                password: data.password,
                password2: data.password2,
                username: data.username,
                editor: data.editor,
                category: data.category,
                experience: data.experience
            }));
        }).then(res => {
            if (res.success === 'true') {
                toastr["success"](res.message);
                setTimeout(() => login(data.username,data.password), 2000);
            }
            else
                toastr["error"](res.message);
        }).catch(() => toastr["error"]('אין גישה לשרת'));
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

function apiAddUserEvent(event) {
    if (!event){
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "http://localhost:3000/calendar");
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve,reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200){
                            resolve(JSON.parse(xhttp.responseText));
                    }
                    else
                        reject();
                }
            };

            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token'),
                event: event
            }));
        });
    }
}

function apiEditUserEvent(event) {
    if (!event){
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/calendar/" + event._id);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve,reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200){
                        resolve(JSON.parse(xhttp.responseText));
                    }
                    else
                        reject();
                }
            };
            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token'),
                event: event
            }));
        });
    }
}

function apiDeleteUserEvent(event) {
    if (!event){
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "http://localhost:3000/calendar/" + event._id);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve,reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200){
                        resolve(JSON.parse(xhttp.responseText));
                    }
                    else
                        reject();
                }
            };
            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token')
            }));
        });
    }
}


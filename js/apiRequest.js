let recaptcha = false;
$(document).ready(function () {
    // $('#submit_form').prop('disabled', true);
});

function login(username, password) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/login");
        xhttp.setRequestHeader("Content-Type", "application/json");
        if(recaptcha) {
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
        else
            toastr["error"]('זיהוי אנושיות לא תקין');
}

function register(data) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/register");
        xhttp.setRequestHeader("Content-Type", "application/json");

        if(recaptcha){
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
        else
            toastr["error"]('זיהוי אנושיות לא תקין');
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

function apiAddUserEvent(event, permitAddEvent) {
    if (!event){
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        if(permitAddEvent === '')
            xhttp.open("PUT", "http://localhost:3000/calendar/" + permitAddEvent);
        else
            xhttp.open("PUT", "http://localhost:3000/permitedCalendar/" + permitAddEvent);

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
            let addTo = eventPermited.findIndex(el => el.event.findIndex(id => id === event._id) >= 0);
            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token'),
                event: event,
                permited_username: addTo >= 0 ? eventPermited[addTo].permited_username : ''
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

function apiGivePermissionsRequest(userName) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/permitedCalendar/givepermissions");
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
                permiteduname: userName
            }));
        });
}

function apiRemovePermissionsRequest(userName) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/permitedCalendar/removepermission/" + userName);
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

function apiGetPermissionEvent(userName) {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/permitedCalendar/getEvents/" + userName);
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

function recaptcha_callback() {
    recaptcha = true;
    $('#submit_form').prop('disabled', false);
}

function PopDetailsEditor(){
    if(!document.getElementById("checkEditor").checked){
        $(".editorDetails").hide();}

    else {
        $(".editorDetails").show();
    }
}

function apiGetCategory() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/categories");
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
        xhttp.send();
    });
}

function setRegisterCategory() {
    let categorySelect = document.getElementById('categoryRegisterSelect').options;
    apiGetCategory().then(res => {
        res.forEach(category => {
            categorySelect.add(new Option(category, category, false));
        })
    });
}
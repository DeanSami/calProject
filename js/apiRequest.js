let recaptcha = false;

$(document).ready(() => {
    let eyePassword = $(".toggle-password");
    eyePassword.mousedown(() => {
        eyePassword.toggleClass("fa-eye");
        eyePassword.removeClass("fa-eye-slash");
        let input = document.querySelector('.field-login-password');
        input.type = 'text';
    });
    eyePassword.mouseup(() => {
        eyePassword.toggleClass("fa-eye-slash");
        eyePassword.removeClass("fa-eye");
        let input = document.querySelector('.field-login-password');
        input.type = 'password';
    });
    let eyePassword2 = $(".toggle-password2");
    eyePassword2.mousedown(() => {
        eyePassword2.toggleClass("fa-eye");
        eyePassword2.removeClass("fa-eye-slash");
        let input = document.querySelector('.field-login-password2');
        input.type = 'text';
    });
    eyePassword2.mouseup(() => {
        eyePassword2.toggleClass("fa-eye-slash");
        eyePassword2.removeClass("fa-eye");
        let input = document.querySelector('.field-login-password2');
        input.type = 'password';
    });
});

function validLogin(username, password) {
    if (username && password)
        return !(password.length > 20 || username.length > 30 || username.length < 6);
    else
        return false
}

function validRegister() {
    fullname = $('.field-register-fullname');
    username = $('.field-register-username');
    password = $('.field-login-password');
    password2 = $('.field-login-password2');
    experience = $('.field-register-experience');
    if (username.val() && password.val() && fullname.val() && password2.val()) {
        return !(password.val().length > 20 || password2.val().length > 20 || password.val().length < 6 || password2.val().length < 6 ||
            username.val().length > 30 || username.val().length < 6 ||
            fullname.val().length > 25 || fullname.val().length < 4 );
    }
    else
        return false
}

function login(username, password) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/login");
    xhttp.setRequestHeader("Content-Type", "application/json");
    if (recaptcha) {
        if (validLogin(username, password)) {
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
                    window.location.assign('index.html');
                }
                else {
                    toastr["error"](res.message);
                }
            }).catch(() => toastr["error"]('אין גישה לשרת'));
        }
        else
            toastr["error"]('שדות לא תקינים');
    }
    else
        toastr["error"]('זיהוי אנושיות לא תקין');
}

function register(data) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/register");
    xhttp.setRequestHeader("Content-Type", "application/json");

    if (recaptcha) {
        if (validRegister()) {
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
                    setTimeout(() => login(data.username, data.password), 2000);
                }
                else
                    toastr["error"](res.message);
            }).catch(() => toastr["error"]('אין גישה לשרת'));
        }
        else
            toastr["error"]('שדות לא תקינים');

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
        xhttp.open("POST", url + "/calendar");
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
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
    if (!event) {
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        if (permitAddEvent === '')
            xhttp.open("PUT", url + "/calendar/" + permitAddEvent);
        else
            xhttp.open("PUT", url + "/permitedCalendar/" + permitAddEvent);

        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
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
    if (!event) {
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", url + "/calendar/" + event._id);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
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
    if (!event) {
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", url + "/calendar/" + event._id);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200) {
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
    xhttp.open("POST", url + "/permitedCalendar/givepermissions");
    xhttp.setRequestHeader("Content-Type", "application/json");

    return new Promise((resolve, reject) => {
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
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
    xhttp.open("DELETE", url + "/permitedCalendar/removepermission/" + userName);
    xhttp.setRequestHeader("Content-Type", "application/json");

    return new Promise((resolve, reject) => {
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
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
    xhttp.open("POST", url + "/permitedCalendar/getEvents/" + userName);
    xhttp.setRequestHeader("Content-Type", "application/json");

    return new Promise((resolve, reject) => {
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
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

function PopDetailsEditor() {
    if (!document.getElementById("checkEditor").checked) {
        $(".editorDetails").hide();
    }

    else {
        $(".editorDetails").show();
    }
}

function apiGetCategory() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "/categories");
    xhttp.setRequestHeader("Content-Type", "application/json");

    return new Promise((resolve, reject) => {
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
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

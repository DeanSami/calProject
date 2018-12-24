let users = [], registerRequest = [], eventRequest = [];

function getAdminRequest() {
    if (!window.localStorage.getItem('username')) {
        toastr["error"]('ארעה שגיאה');
        window.location.assign('index.html');
        return null;
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/admin/requests");
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(JSON.parse(xhttp.responseText));
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

function buildAdminRequestTable() {
    getAdminRequest().then(res => {
        if (res.success === 'true') {
            registerRequest = res.register_requests;
            eventRequest = res.event_requests;
            if ('content' in document.createElement('template')) {
                for (let i = 0; i < registerRequest.length; i++) {
                    let t = document.querySelector('#requestTemplate');

                    // Clone the new row and insert it into the table
                    let tb = document.getElementById("registerRequest");

                    let clone = document.importNode(t.content, true);
                    let td = clone.querySelectorAll("td");
                    td[0].textContent = (i + 1).toString();
                    td[1].textContent = registerRequest[i].fullname;
                    td[2].textContent = registerRequest[i].experience;
                    td[3].textContent = registerRequest[i].category;
                    td[4].innerHTML = `<button type="button" class="btn btn-success mr-2" id="acceptRequestButton"` +
                        `onclick='ioRegisterRequest("${registerRequest[i]._id}", "true", "${i}", "register")' > אשר </button>` +
                        `<button type="button" class="btn btn-danger mr-2" id="acceptRequestButton"` +
                        `onclick='ioRegisterRequest("${registerRequest[i]._id}", "false", "${i}", "register")' > סרב </button>`;
                    tb.appendChild(clone);
                }


                for (let i = 0; i < eventRequest.length; i++) {
                    let t = document.querySelector('#eventRequestTemplate');

                    // Clone the new row and insert it into the table
                    let tb = document.getElementById("eventRequest");

                    let clone = document.importNode(t.content, true);
                    let td = clone.querySelectorAll("td");
                    td[0].textContent = (i + 1).toString();
                    td[1].textContent = eventRequest[i].title;
                    td[2].textContent = eventRequest[i].delete ? 'מחיקה' : 'עריכה';
                    td[3].textContent = moment(eventRequest[i].start).format('DD/MM/YYYY').toString();
                    td[4].textContent = eventRequest[i].reason;
                    td[5].innerHTML = `<button type="button" class="btn btn-success mr-2" id="acceptRequestButton"` +
                        `onclick='ioRegisterRequest("${eventRequest[i]._id}", "true", "${i}", "event")' > אשר </button>` +
                        `<button type="button" class="btn btn-danger mr-2" id="acceptRequestButton"` +
                        `onclick='ioRegisterRequest("${eventRequest[i]._id}", "false", "${i}", "event")' > סרב </button>`;
                    tb.appendChild(clone);
                }
            }

        }
        else
            toastr["error"](res.message);
    }).catch(rej => {

    });
}

function getUserRequest() {
    if (!window.localStorage.getItem('username')) {
        toastr["error"]('ארעה שגיאה');
        window.location.assign('index.html');
        return null;
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/admin/getusers");
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(JSON.parse(xhttp.responseText));
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

function buildUserTable() {
    getUserRequest().then(res => {
        if (res.success === 'true') {
            users = res.users;
            if ('content' in document.createElement('template')) {
                for (let i = 0; i < users.length; i++) {
                    let t = document.querySelector('#usersTemplate');

                    let tb = document.getElementById("usersRequest");


                    let clone = document.importNode(t.content, true);
                    td = clone.querySelectorAll("td");
                    td[0].textContent = (i + 1).toString();
                    td[1].textContent = users[i].fullname;
                    td[2].textContent = moment(users[i].registeredAt).format('DD/MM/YYYY');
                    td[3].textContent = users[i].username;
                    td[4].innerHTML =
                        `<button type="button" class="btn btn-success mr-2" id="acceptRequestButton"` +
                        `onclick='editUserMode("${users[i].username}", "${users[i].fullname}")'> ערוך</button>` +
                        `<button type="button" class="btn btn-danger mr-2"` +
                        `onclick='deleteUser("${users[i].username}","${i}")'>מחק</button>`;
                    tb.appendChild(clone);
                }
            }
            else
                toastr["error"]('דפדפן לא נתמך');

        }
        else
            toastr["error"](res.message);
    }).catch(() => toastr["error"]('ארעה שגיאה'));
}

function filterUserTable(key) {
    if (users) {
        if (key !== '') {
            let node = document.getElementById('usersRequest');
            while (node.hasChildNodes())
                node.removeChild(node.lastChild);
            if ('content' in document.createElement('template')) {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username.search(key) >= 0 || users[i].fullname.search(key) >= 0) {
                        let t = document.querySelector('#usersTemplate');
                        let tb = document.getElementById('usersRequest');
                        let clone = document.importNode(t.content, true);
                        td = clone.querySelectorAll("td");
                        td[0].textContent = (i + 1).toString();
                        td[1].textContent = users[i].fullname;
                        td[2].textContent = moment(users[i].registeredAt).format('DD/MM/YYYY');
                        td[3].textContent = users[i].username;
                        td[4].innerHTML =
                            `<button type="button" class="btn btn-success mr-2"` +
                            `onclick='editUserMode("${users[i].username}", "${users[i].fullname}")'>ערוך</button>` +
                            `<button type="button" class="btn btn-danger mr-2"` +
                            `onclick='deleteUser("${users[i].username}","${i}")'>מחק</button>`;
                        tb.appendChild(clone);
                    }
                }
            }
            else
                toastr["error"]('דפדפן לא נתמך');
        }
        else
            toastr["error"]('נא הקלד חיפוש');
    }
}

function filterRegisterTable(key) {
    if (registerRequest) {
        if (key !== '') {
            let node = document.getElementById('registerRequest');
            while (node.hasChildNodes())
                node.removeChild(node.lastChild);
            if ('content' in document.createElement('template')) {
                for (let i = 0; i < registerRequest.length; i++) {
                    if (registerRequest[i].fullname.search(key) >= 0 || registerRequest[i].category[0].search(key) >= 0 || key === '.') {
                        let t = document.querySelector('#requestTemplate');
                        let tb = document.getElementById("registerRequest");
                        let clone = document.importNode(t.content, true);
                        let td = clone.querySelectorAll("td");
                        td[0].textContent = (i + 1).toString();
                        td[1].textContent = registerRequest[i].fullname;
                        td[2].textContent = registerRequest[i].experience;
                        td[3].textContent = registerRequest[i].category;
                        td[4].innerHTML = `<button type="button" class="btn btn-success mr-2" id="acceptRequestButton"` +
                            `onclick='ioRegisterRequest("${registerRequest[i]._id}", "true", "${i}", "register")' > אשר </button>` +
                            `<button type="button" class="btn btn-danger mr-2" id="acceptRequestButton"` +
                            `onclick='ioRegisterRequest("${registerRequest[i]._id}", "false", "${i}", "register")' > סרב </button>`;
                        tb.appendChild(clone);
                    }
                }
            }
            else
                toastr["error"]('דפדפן לא נתמך');
        }
        else
            toastr["error"]('נא הקלד חיפוש');
    }
}

function filterEventTable(key) {
    if (eventRequest) {
        if (key !== '') {
            let node = document.getElementById('eventRequest');
            while (node.hasChildNodes())
                node.removeChild(node.lastChild);
            if ('content' in document.createElement('template')) {
                for (let i = 0; i < eventRequest.length; i++) {
                    if (eventRequest[i].title.search(key) >= 0 || eventRequest[i].reason.search(key) >= 0 || key === '.') {
                        let t = document.querySelector('#eventRequestTemplate');
                        let tb = document.getElementById("eventRequest");

                        let clone = document.importNode(t.content, true);
                        let td = clone.querySelectorAll("td");
                        td[0].textContent = (i + 1).toString();
                        td[1].textContent = eventRequest[i].title;
                        td[2].textContent = eventRequest[i].delete ? 'מחיקה' : 'עריכה';
                        td[3].textContent = moment(eventRequest[i].start).format('DD/MM/YYYY').toString();
                        td[4].textContent = eventRequest[i].reason;
                        td[5].innerHTML = `<button type="button" class="btn btn-success mr-2" id="acceptRequestButton"` +
                            `onclick='ioRegisterRequest("${eventRequest[i]._id}", "true", "${i}", "event")' > אשר </button>` +
                            `<button type="button" class="btn btn-danger mr-2" id="acceptRequestButton"` +
                            `onclick='ioRegisterRequest("${eventRequest[i]._id}", "false", "${i}", "event")' > סרב </button>`;
                        tb.appendChild(clone);
                    }
                }
            }
            else
                toastr["error"]('דפדפן לא נתמך');
        }
        else
            toastr["error"]('נא הקלד חיפוש');
    }
}


function sendApiEditUser(username, info) {
    if (!window.localStorage.getItem('username')) {
        toastr["error"]('ארעה שגיאה');
        window.location.assign('index.html');
        return null;
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/admin/updateuser/" + username);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(JSON.parse(xhttp.responseText));
                    reject();
                }
            };
            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token'),
                edit_info: info
            }));
        })
    }
}

function editUserMode(username, fullname) {
    $('#editUserModal').modal('show');
    document.getElementById('title-edit-user').innerHTML = username;
    document.getElementById('full-name-edit-user').value = fullname;
}

function editUser() {
    let username = document.getElementById('title-edit-user').innerHTML;
    let info =
        {
            fullname: document.getElementById('full-name-edit-user').value,
            password: document.getElementById('password-edit-user').value,
        };
    sendApiEditUser(username, info).then(res => {
        if (res.success === 'true') {
            toastr["success"](res.message);
            idx = users.findIndex(user => user.username === username);
            if (idx >= 0)
                users[idx].fullname = info.fullname;
            filterUserTable('.');
            $('#editUserModal').modal('hide');
        }
        else
            toastr["success"](res.message);
    }).catch(() => toastr["error"]('ארעה שגיאה'));

}

function deleteUser(username, index) {
    bootbox.confirm({
        message: '<div style="text-align: center"> האם אתה בטוח שאתה רוצה למחוק את המשתמש?</div>',
        size: "small",
        animate: true,
        buttons: {
            confirm: {
                label: 'אישור',
                className: 'btn-success pull-right'
            },
            cancel: {
                label: 'בטל',
                className: 'btn-danger pull-right'
            }
        },
        callback: result => {
            if (result) {
                sendApiDeleteUser(username).then(res => {
                    if (res.success === 'true') {
                        toastr["success"](res.message);
                        let table = document.getElementById("usersRequest");
                        table.removeChild(table.children[index]);
                    }
                    else
                        toastr["error"](res.message);
                }).catch(() => {
                    toastr["error"]('ארעה שגיאה');
                });
            }
        }
    });
}

function sendApiDeleteUser(username) {
    if (!window.localStorage.getItem('username')) {
        toastr["error"]('ארעה שגיאה');
        window.location.assign('index.html');
        return null;
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "http://localhost:3000/admin/deleteuser/" + username);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(JSON.parse(xhttp.responseText));
                    reject();
                }
            };
            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token')
            }));
        })
    }

}


function sendApiAcceptRequest(id, approve) {
    if (!window.localStorage.getItem('username')) {
        toastr["error"]('ארעה שגיאה');
        window.location.assign('index.html');
        return null;
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/admin/requests/" + id);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhttp.onreadystatechange = () => {
                if (xhttp.readyState === 4) {
                    if (xhttp.status === 200)
                        resolve(JSON.parse(xhttp.responseText));
                    reject();
                }
            };
            xhttp.send(JSON.stringify({
                username: window.localStorage.getItem('username'),
                token: window.localStorage.getItem('token'),
                approve: approve.toString()
            }));
        })
    }
}

function ioRegisterRequest(id, approve, index, kind) {
    bootbox.confirm({
        message: '<div style="text-align: center"> האם אתה בטוח שאתה רוצה לבצע את הסינון?</div>',
        size: "small",
        animate: true,
        buttons: {
            confirm: {
                label: 'אישור',
                className: 'btn-success pull-right'
            },
            cancel: {
                label: 'בטל',
                className: 'btn-danger pull-right'
            }
        },
        callback: result => {
            if (result) {
                sendApiAcceptRequest(id, approve).then(res => {
                    if (res.success === 'true') {
                        toastr["success"](res.message);
                        switch (kind) {
                            case 'register':
                                let tableRegister = document.getElementById("registerRequest");
                                tableRegister.removeChild(tableRegister.children[index]);
                                break;
                            case 'event':
                                let tableEvent = document.getElementById("eventRequest");
                                tableEvent.removeChild(tableEvent.children[index]);
                                break;
                        }
                    }
                    else
                        toastr["error"](res.message);
                }).catch(() => {
                    toastr["error"]('ארעה שגיאה');
                });
            }
        }
    });
}

function signOut() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
}
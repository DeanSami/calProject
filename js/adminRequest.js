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
            let registerRequest = res.register_requests;
            if ('content' in document.createElement('template')) {
                for (let i = 0; i < registerRequest.length; i++) {
                    let t = document.querySelector('#requestTemplate');

                    // Clone the new row and insert it into the table
                    let tb = document.querySelector("tbody");

                    let clone = document.importNode(t.content, true);
                    td = clone.querySelectorAll("td");
                    td[0].textContent = (i+1).toString();
                    td[1].textContent = registerRequest[i].fullname;
                    td[2].textContent = registerRequest[i].experience;
                    td[3].textContent = registerRequest[i].category;
                    td[4].innerHTML = `<button type="button" class="btn btn-success mr-2" id="acceptRequestButton"` +
                        `onclick='ioRegisterRequest("${registerRequest[i]._id}", "true", "${i}")' > אשר </button>` +
                        `<button type="button" class="btn btn-danger mr-2" id="acceptRequestButton"` +
                        `onclick='ioRegisterRequest("${registerRequest[i]._id}", "false", "${i}")' > סרב </button>`;
                    tb.appendChild(clone);
                }
            }
        }
        else
            toastr["error"](res.message);
    }).catch(rej => {

    });
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

function ioRegisterRequest(id, approve, index) {
    sendApiAcceptRequest(id, approve).then(res => {
        if(res.success === 'true'){
            toastr["success"](res.message);
            let table = document.getElementById("registerRequest");
            table.removeChild(table.children[index]);
        }
        else
            toastr["error"](res.message);
    }).catch(() => {
        toastr["error"]('ארעה שגיאה');
    });
}

function signOut() {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
}
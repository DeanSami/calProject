$(document).ready(function () {
    // $('#submit_form').prop('disabled', true);
});


function getGlobalEvents() {
    if (!window.localStorage.getItem('username')) {
        toastr["error"]('ארעה שגיאה');
        return null;
    }
    else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/globalCal");
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

function userPullGlobalEvent(eventId){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/globalCal/pull/" + eventId);
        xhttp.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve,reject) => {
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

function apiAddEditorGlobalEvent(event) {
    if (!event){
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "http://localhost:3000/globalCal");
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

function apiEditGlobalEvent(event) {
    if (!event){
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/globalCal/" + event._id);
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
                event: event,
                reason: $('#reasonEdit').val()
            }));
        });
    }
}

function apiDeleteGlobalEvent(event) {
    if (!event){
        toastr["error"]('ארעה שגיאה');
        return null;
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", "http://localhost:3000/globalCal/" + event._id);
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
                reason: $('#reasonEdit').val()
            }));
        });
    }
}
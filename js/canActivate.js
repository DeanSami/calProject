let url='http://104.248.95.224:3000';
$(document).ready(() => {
    $("#loading").show(1000);
    $(".user-form").hide();
    $(".loadingHide").show();
    let currentUrl = window.location.pathname.split('/');
    if (window.localStorage.getItem('username') && window.localStorage.getItem('token')) {
        canActivate().then(res => {
            if (res.success === 'true') {
                setTimeout(() => {
                    if (currentUrl[currentUrl.length - 1] === 'login.html' || currentUrl[currentUrl.length - 1] === 'register.html')
                        window.location.assign('index.html');
                    else {
                        let currentUserDiv = $('.currentUser');
                        switch (res.permission) {
                            case 'user':
                                currentUserDiv.html('משתמש מחובר');
                                break;
                            case 'editor':
                                currentUserDiv.html('עורך תוכן מחובר');
                                break;
                            case 'admin':
                                currentUserDiv.html('<a href="admin-panel.html" alt="פאנל ניהול מנהל">מנהל</a> מחובר');
                                break;
                        }
                        switch(currentUrl[currentUrl.length - 1]) {
                            case '':
                                loadCalendar().then(() => closeLoading()).catch(() => window.location.assign('/404'));
                                break;
                            case 'index.html':
                                loadCalendar().then(() => closeLoading()).catch(() => window.location.assign('/404'));
                                break;
                            case 'global.html':
                                loadGlobalCalendar().then(() => closeLoading()).catch(() => window.location.assign('/404'));
                                break;
                            case 'admin-panel.html':
                                if(res.permission !== 'admin')
                                    window.location.assign('index.html');
                                else{
                                    buildAdminRequestTable();
                                    buildUserTable();
                                    reports();
                                    closeLoading();
                                }
                                break;
                            default:
                                window.location.assign('login.html');
                        }
                        // $("#loading").hide(1000);
                        // $(".user-form").show(1000);
                        // $(".main").show(1000);
                    }
                }, 100);
            }
            else {
                if (currentUrl[currentUrl.length - 1] !== 'login.html' && currentUrl[currentUrl.length - 1] !== 'register.html')
                    window.location.assign('login.html');
                else {
                    $("#loading").hide(1000);
                }
                $(".user-form").show(1000);
                $(".loadingHide").hide(1000);
            }
        })
            .catch(() => toastr["error"]('אין גישה לשרת'));
    }
    else {
        if (currentUrl[currentUrl.length - 1] === 'login.html' || currentUrl[currentUrl.length - 1] === 'register.html') {
            if(currentUrl[currentUrl.length - 1] === 'register.html')
                setRegisterCategory();
            $("#loading").hide(1000);
            $(".user-form").show(1000);
            $(".loadingHide").hide(1000);
        }
        else
            window.location.assign('login.html');
    }
});


function canActivate() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", url + "/canActivate");
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

function closeLoading() {
    $("#loading").hide(1000);
    $(".user-form").show(1000);
    $(".loadingHide").hide(1000);
}
if (window.localStorage.getItem('username') && window.localStorage.getItem('token')){
    $("#calendar").hide();
    canActivate();
    $("#loading").hide();
    $("#calendar").show();

}
else
    window.location.assign('login.html');

    function canActivate() {
        let currentUrl = window.location.pathname.split('/');
        let xhttp = new XMLHttpRequest(), method = "POST", url = "http://localhost:3000/" + currentUrl[currentUrl.length - 1];
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
                        toastr["success"](response.message);
                    }
                    else {
                        window.location.assign('login.html');
                    }
                }
            }
        };
}
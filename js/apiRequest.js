function login(email,password) {
    let xhttp = new XMLHttpRequest(),
        method = "POST",
        url = "localhost:3000/login";

    xhttp.open(method, url, true);
    xhttp.onreadystatechange = function () {
        if(xhttp.readyState === 4 && xhttp.status === 200) {
            window.location.replace("index.html");
    }
    };
    xhttp.send("email=" + email + "&password=" + password);
}
// localhost:3000/login
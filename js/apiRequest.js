xhttp = new XMLHttpRequest();
function login(email,password) {
    let xhr = new XMLHttpRequest(),
        method = "POST",
        url = "";

    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        }
    };
    xhr.send("email=" + email + "&password=" + password);
}

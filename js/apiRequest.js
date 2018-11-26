function login(username, password) {
    let xhttp = new XMLHttpRequest(),
    method = "POST",
    url = "http://localhost:3000/login",
    async = true;
    
    xhttp.open(method, url);

    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    
    let userDetails = JSON.stringify({
        username: username,
        password: password
    });
    xhttp.send(userDetails);
    
    xhttp.onreadystatechange = () => {
        if(xhttp.readyState === 4 && xhttp.status === 200) {
            let response = JSON.parse(xhttp.responseText);
            if (response) {
                console.log(response);
                if (response.success === "true") window.location.assign('index.html');
                else {document.getElementById("error").innerHTML = "<h2>שגיאה</h2>";}
            }
            
        }
    };
}

// localhost:3000/login
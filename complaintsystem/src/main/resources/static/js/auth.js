const apiBase = "http://localhost:8080/api/auth";
const registerForm = document.getElementById("registerForm");
if(registerForm){
    registerForm.addEventListener("submit", async e=>{
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${apiBase}/register`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({name,email,password})
        });

        const msg = await res.text();
        alert(msg);
        if(msg.toLowerCase().includes("success")){
            window.location.href = "login.html";
        }
    });
}

// Login
const loginForm = document.getElementById("loginForm");
if(loginForm){
    loginForm.addEventListener("submit", async e=>{
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const res = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email,password})
        });

        const tokenOrMsg = await res.text();

        if(tokenOrMsg.startsWith("ey")){ // JWT token
            localStorage.setItem("token", tokenOrMsg);
            if(email.toLowerCase().includes("admin")) window.location.href = "admin.html";
            else window.location.href = "user.html";
        } else {
            alert(tokenOrMsg);
        }
    });
}
function getToken() {
    return localStorage.getItem("token");
}

function checkAuth() {
    if (!getToken()) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

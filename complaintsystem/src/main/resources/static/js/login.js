document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.text())
    .then(token => {
        if (!token || !token.startsWith("ey")) {
            alert("Invalid email or password");
            return;
        }

        localStorage.setItem("token", token);

        if (email.toLowerCase().includes("admin")) {
            window.location.href = "admin.html";
        } else {
            window.location.href = "user.html";
        }
    })
    .catch(err => {
        console.error(err);
        alert("Login failed");
    });
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault(); 

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);

        if (msg.toLowerCase().includes("success")) {
            window.location.href = "login.html";
        }
    })
    .catch(err => {
        console.error(err);
        alert("Registration failed");
    });
});

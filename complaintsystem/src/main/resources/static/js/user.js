document.addEventListener("DOMContentLoaded", () => {

    if (document.querySelector("#complaintTable")) {
        loadMyComplaints();
    }

    const form = document.getElementById("complaintForm");
    if (!form) return; 

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", document.getElementById("title").value);
        formData.append("category", document.getElementById("category").value);
        formData.append("description", document.getElementById("description").value);
        formData.append("address", document.getElementById("address").value);

        const photoInput = document.getElementById("photo");
        if (photoInput && photoInput.files.length > 0) {
            formData.append("photo", photoInput.files[0]);
        }

        fetch("api/complaints", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error("Submit failed");
            return res.text();
        })
        .then(() => {
            alert("Complaint submitted successfully");
            form.reset();
            loadMyComplaints();
        })
        .catch(err => {
            console.error(err);
            alert("Failed to submit complaint");
        });
    });
});

function loadMyComplaints() {
    fetch("api/complaints/my", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("403");
        return res.json();
    })
    .then(data => {
        const tbody = document.querySelector("#complaintTable tbody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">No complaints found</td></tr>`;
            return;
        }
		data.forEach(c => {

		    const formattedDate = c.createdAt
		        ? new Date(c.createdAt).toLocaleString("en-IN", {
		            dateStyle: "medium",
		            timeStyle: "short"
		        })
		        : "-";

		    tbody.innerHTML += `
		        <tr>
		            <td>${c.id}</td>
		            <td>${c.title}</td>
		            <td>${c.category}</td>
		            <td>
		                <span class="status ${c.status.toLowerCase()}">${c.status}</span>
		            </td>
		            <td>${formattedDate}</td>
		            <td>${c.address ?? "-"}</td>
		            <td>
		                ${c.photoPath 
		                    ? `<img src="http://localhost:8080/uploads/${c.photoPath}" class="complaint-photo">`
		                    : "-"
		                }
		            </td>
					<td>${c.adminComment ?? "—"}</td>
		        </tr>
		    `;
		});

    })
    .catch(err => console.error("Load failed", err));
}
function deleteComplaint(id) {
    if (!confirm("Are you sure you want to delete this complaint?")) return;

    fetch(`api/complaints/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        alert("Complaint deleted");
        loadMyComplaints(); 
    })
    .catch(err => alert("Failed to delete"));
}


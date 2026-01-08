window.onload = function () {
    checkAuth();
    loadAllComplaints();
};

function loadAllComplaints() {
    fetch("/api/complaints/all", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("ADMIN DATA:", data);

        updateCards(data);
        renderTable(data);
    });
}

function updateCards(data) {
    document.getElementById("totalComplaints").innerText = data.length;
    document.getElementById("pendingComplaints").innerText =
        data.filter(c => c.status === "PENDING").length;
    document.getElementById("resolvedComplaints").innerText =
        data.filter(c => c.status === "RESOLVED").length;
    document.getElementById("rejectedComplaints").innerText =
        data.filter(c => c.status === "REJECTED").length;
}

function changeStatus(id, status) {
    fetch(`/api/complaints/${id}/status?status=${status}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(() => {
        alert("Status updated");
        loadAllComplaints(); 
    })
    .catch(err => console.error(err));
}
function renderTable(data) {
    const tbody = document.querySelector("#adminTable tbody");
    tbody.innerHTML = "";

    data.forEach(c => {
        tbody.innerHTML += `
          <tr>
            <td>${c.id}</td>
            <td>${c.title}</td>
            <td>${c.category}</td>
			<td><span class="status ${c.status}">${c.status}</span></td>
			<td>${c.user?.email ?? "-"}</td>
            <td>${c.createdAt ? c.createdAt.substring(0,10) : ""}</td>
            <td>${c.address ? c.address : "-"}</td>
            <td>
              ${c.photoPath 
                ? `<img src="/uploads/${c.photoPath}" width="60">` 
                : "-"}
            </td>
            <td>
              <select onchange="changeStatus(${c.id}, this.value)">
                <option value="PENDING" ${c.status==="PENDING"?"selected":""}>PENDING</option>
                <option value="RESOLVED" ${c.status==="RESOLVED"?"selected":""}>RESOLVED</option>
                <option value="REJECTED" ${c.status==="REJECTED"?"selected":""}>REJECTED</option>
              </select>
            </td>
			<td>
			  <input 
			    type="text"
			    placeholder="Add comment"
			    value="${c.adminComment ?? ''}"
			    onblur="saveComment(${c.id}, this.value)"
			    class="comment-input"
			  />
			</td>

          </tr>
        `;
    });
}

function saveComment(id, comment) {
    fetch(`/api/complaints/${id}/comment?comment=${encodeURIComponent(comment)}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to save comment");
    })
    .catch(err => {
        console.error(err);
        alert("Comment save failed");
    });
}


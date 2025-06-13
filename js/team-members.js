// Team members view for technical monitor

function getCurrentTeamId() {
  // Placeholder for getting current team ID logic
  return "team123" // Example team ID
}

document.addEventListener("DOMContentLoaded", () => {
  // Load team members data
  loadTeamMembers()
})

// Load team members data
function loadTeamMembers() {
  const teamId = getCurrentTeamId()

  if (!teamId) {
    alert("Team ID could not be determined")
    return
  }

  const members = JSON.parse(localStorage.getItem("members") || "[]")
  const teamMembers = members.filter((member) => member.teamId === teamId)
  const tableBody = document.querySelector("#teamMembersTable tbody")

  if (tableBody) {
    tableBody.innerHTML = ""

    if (teamMembers.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No team members found</td></tr>'
      return
    }

    teamMembers.forEach((member) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${member.id}</td>
                <td>${member.fullName}</td>
                <td>${member.role === "rescuer" ? "Rescuer" : "Technical Monitor"}</td>
                <td>${member.phone}</td>
                <td>${member.email}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-small" onclick="viewMemberDetails('${member.id}')">View Details</button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)
    })
  }
}

// View member details
function viewMemberDetails(memberId) {
  window.location.href = `member-details.html?memberId=${memberId}`
}

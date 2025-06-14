// Teams management

function getUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

document.addEventListener("DOMContentLoaded", () => {
  // Load teams data
  loadTeams()

  // Add team button
  const addTeamBtn = document.getElementById("addTeamBtn")
  if (addTeamBtn) {
    addTeamBtn.addEventListener("click", () => {
      openTeamModal()
    })
  }

  // Team form submission
  const teamForm = document.getElementById("teamForm")
  if (teamForm) {
    teamForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveTeam()
    })
  }

  // Cancel button
  const cancelTeamBtn = document.getElementById("cancelTeamBtn")
  if (cancelTeamBtn) {
    cancelTeamBtn.addEventListener("click", () => {
      closeTeamModal()
    })
  }

  // Close modal when clicking on X
  const closeModal = document.querySelector(".close-modal")
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      closeTeamModal()
    })
  }

  // Cancel delete
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn")
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => {
      closeDeleteModal()
    })
  }
})

// Load teams data
function loadTeams() {
  const params = getUrlParams()
  const beach_id = params.beach_id

  if (!beach_id) {
    alert("Beach ID is missing")
    return
  }

  const teams = JSON.parse(localStorage.getItem("teams") || "[]")
  const beachTeams = teams.filter((team) => team.beachId === beach_id)
  const tableBody = document.querySelector("#teamsTable tbody")

  if (tableBody) {
    tableBody.innerHTML = ""

    if (beachTeams.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No teams found</td></tr>'
      return
    }

    beachTeams.forEach((team) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${team.id}</td>
                <td>${team.name}</td>
                <td>${team.username}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-small" onclick="viewMembers('${team.id}')">View Members</button>
                        <button class="btn btn-small btn-secondary" onclick="editTeam('${team.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="confirmDeleteTeam('${team.id}')">Delete</button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)
    })
  }
}

// Open team modal
function openTeamModal(team_id = null) {
  const modal = document.getElementById("teamModal")
  const modalTitle = document.getElementById("modalTitle")
  const teamIdInput = document.getElementById("teamId")
  const teamNameInput = document.getElementById("teamName")
  const teamUsernameInput = document.getElementById("teamUsername")
  const teamPasswordInput = document.getElementById("teamPassword")

  if (team_id) {
    // Edit mode
    const team = getTeamById(team_id)

    if (team) {
      modalTitle.textContent = "Edit Team"
      teamIdInput.value = team.team_id
      teamNameInput.value = team.team_name
      teamUsernameInput.value = team.username
      teamPasswordInput.value = "" // Don't show password for security
    }
  } else {
    // Add mode
    modalTitle.textContent = "Add Team"
    teamIdInput.value = ""
    teamNameInput.value = ""
    teamUsernameInput.value = ""
    teamPasswordInput.value = ""
  }

  modal.style.display = "block"
}

// Close team modal
function closeTeamModal() {
  const modal = document.getElementById("teamModal")
  modal.style.display = "none"
  document.getElementById("teamForm").reset()
}

// Save team
function saveTeam() {
  const params = getUrlParams()
  const beach_id = params.beach_id

  if (!beach_id) {
    alert("Beach ID is missing")
    return
  }

  const teamId = document.getElementById("teamId").value
  const teamName = document.getElementById("teamName").value
  const teamUsername = document.getElementById("teamUsername").value
  const teamPassword = document.getElementById("teamPassword").value

  if (!teamName || !teamUsername) {
    alert("Please enter team name and username")
    return
  }

  const teams = JSON.parse(localStorage.getItem("teams") || "[]")

  if (teamId) {
    // Update existing team
    const index = teams.findIndex((t) => t.id === teamId)
    if (index !== -1) {
      teams[index].name = teamName
      teams[index].username = teamUsername
      if (teamPassword) {
        teams[index].password = teamPassword
      }
    }
  } else {
    // Add new team
    if (!teamPassword) {
      alert("Please enter password for new team")
      return
    }

    const newTeam = {
      id: Date.now().toString(),
      beachId: beach_id,
      name: teamName,
      username: teamUsername,
      password: teamPassword,
    }
    teams.push(newTeam)
  }

  localStorage.setItem("teams", JSON.stringify(teams))
  closeTeamModal()
  loadTeams()
}

// Edit team
function editTeam(teamId) {
  openTeamModal(teamId)
}

// View members
function viewMembers(team_id) {
  const params = getUrlParams()
  window.location.href = `members.html?beach_id=${params.beach_id}&team_id=${team_id}`
}

// Confirm delete team
function confirmDeleteTeam(team_id) {
  const deleteModal = document.getElementById("deleteModal")
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")

  // Set up delete confirmation
  confirmDeleteBtn.onclick = () => {
    deleteTeam(team_id)
    closeDeleteModal()
  }

  deleteModal.style.display = "block"
}

// Close delete modal
function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal")
  deleteModal.style.display = "none"
}

// Delete team
function deleteTeam(teamId) {
  let teams = JSON.parse(localStorage.getItem("teams") || "[]")
  teams = teams.filter((t) => t.id !== teamId)
  localStorage.setItem("teams", JSON.stringify(teams))

  // Also delete related members
  let members = JSON.parse(localStorage.getItem("members") || "[]")
  members = members.filter((m) => m.teamId !== teamId)
  localStorage.setItem("members", JSON.stringify(members))

  loadTeams()
}

// Technical Monitor specific functions

// Function to get URL parameters
function getUrlParams() {
  const params = {}
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
    params[key] = value
  })
  return params
}

// Initialize data in localStorage if it doesn't exist
function initializeData() {
  if (!localStorage.getItem("drones")) {
    localStorage.setItem("drones", JSON.stringify([]))
  }
  if (!localStorage.getItem("surveys")) {
    localStorage.setItem("surveys", JSON.stringify([]))
  }
  if (!localStorage.getItem("detections")) {
    localStorage.setItem("detections", JSON.stringify([]))
  }
}

// Get current team ID based on logged in user
function getCurrentTeamId() {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) return null

  const teams = JSON.parse(localStorage.getItem("teams") || "[]")
  const team = teams.find((t) => t.username === currentUser)

  return team ? team.id : null
}

// Update breadcrumb with drone name
function updateBreadcrumb() {
  const params = getUrlParams()

  // Update drone name in breadcrumb
  if (params.droneId) {
    const drones = JSON.parse(localStorage.getItem("drones") || "[]")
    const drone = drones.find((d) => d.id === params.droneId)

    const droneNameElements = document.querySelectorAll("#droneNameDisplay, #droneNameTitle")
    droneNameElements.forEach((el) => {
      if (el && drone) {
        el.textContent = drone.name
      }
    })
  }

  // Update member name in breadcrumb
  if (params.memberId) {
    const members = JSON.parse(localStorage.getItem("members") || "[]")
    const member = members.find((m) => m.id === params.memberId)

    const memberNameElements = document.querySelectorAll("#memberNameDisplay, #memberNameTitle")
    memberNameElements.forEach((el) => {
      if (el && member) {
        el.textContent = member.fullName
      }
    })
  }
}

// Initialize technical monitor pages
document.addEventListener("DOMContentLoaded", () => {
  initializeData()
  updateBreadcrumb()
})

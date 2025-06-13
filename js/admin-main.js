// Global variables
let overviewMap, teamMap
let currentView = "overview"
let currentBeach = null

// Declare necessary variables and functions
const L = window.L // Assuming Leaflet is loaded globally
const DATABASE = {
  beaches: [],
  teams: [],
}

function getBeachStats(beachId) {
  // Mock function to get beach stats
  return {
    totalTeams: 0,
    totalMembers: 0,
  }
}

function getBeachById(beachId) {
  // Mock function to get beach by ID
  return DATABASE.beaches.find((beach) => beach.beach_id === beachId)
}

function getTeamsByBeachId(beachId) {
  // Mock function to get teams by beach ID
  return DATABASE.teams.filter((team) => team.beach_id === beachId)
}

function generateId() {
  // Mock function to generate a unique ID
  return Math.random().toString(36).substr(2, 9)
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  if (localStorage.getItem("userRole") !== "admin") {
    window.location.href = "../login.html"
    return
  }

  initializeOverviewMap()
  loadBeachList()
  updateStats()
})

// Initialize overview map
function initializeOverviewMap() {
  overviewMap = L.map("overviewMap").setView([14.0583, 108.2772], 6)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(overviewMap)

  // Add beach markers
  DATABASE.beaches.forEach((beach) => {
    const stats = getBeachStats(beach.beach_id)
    const marker = L.marker([beach.latitude, beach.longitude])
      .addTo(overviewMap)
      .bindPopup(`
        <div class="popup-content">
          <h3>${beach.beach_name}</h3>
          <p>${stats.totalTeams} teams • ${stats.totalMembers} thành viên</p>
        </div>
      `)

    marker.on("click", () => {
      showBeachDetail(beach.beach_id)
    })
  })
}

// Initialize team map
function initializeTeamMap(beachId) {
  const beach = getBeachById(beachId)
  const teams = getTeamsByBeachId(beachId)

  if (teamMap) {
    teamMap.remove()
  }

  teamMap = L.map("teamMap").setView([beach.latitude, beach.longitude], 12)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(teamMap)

  // Add team markers
  teams.forEach((team) => {
    const iconColor = team.status === "active" ? "#00b894" : "#b2bec3"

    const customIcon = L.divIcon({
      html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      className: "custom-marker",
    })

    const marker = L.marker([team.latitude, team.longitude], { icon: customIcon })
      .addTo(teamMap)
      .bindPopup(`
        <div class="popup-content">
          <h3>${team.team_name}</h3>
          <p>${team.members} thành viên • ${team.status === "active" ? "Hoạt động" : "Không hoạt động"}</p>
        </div>
      `)
  })
}

// Load beach list
function loadBeachList() {
  const beachList = document.getElementById("beachList")
  beachList.innerHTML = ""

  DATABASE.beaches.forEach((beach) => {
    const stats = getBeachStats(beach.beach_id)
    const beachItem = createBeachItem(beach, stats)
    beachList.appendChild(beachItem)
  })
}

// Create beach item element
function createBeachItem(beach, stats) {
  const item = document.createElement("div")
  item.className = "beach-item"
  item.onclick = () => showBeachDetail(beach.beach_id)

  item.innerHTML = `
    <div class="beach-header">
      <div>
        <div class="beach-name">${beach.beach_name}</div>
        <div class="beach-location">
          📍 ${beach.latitude.toFixed(4)}, ${beach.longitude.toFixed(4)}
        </div>
      </div>
      <div class="beach-status ${beach.status}">Hoạt động</div>
    </div>
    <div class="beach-teams">
      <span>👥</span>
      <span>${stats.totalTeams} teams cứu hộ</span>
    </div>
  `

  return item
}

// Load team list
function loadTeamList(beachId) {
  const teamList = document.getElementById("teamList")
  const teams = getTeamsByBeachId(beachId)

  teamList.innerHTML = ""

  teams.forEach((team) => {
    const teamItem = createTeamItem(team)
    teamList.appendChild(teamItem)
  })
}

// Create team item element
function createTeamItem(team) {
  const item = document.createElement("div")
  item.className = "team-item"

  const teamInitials = team.team_name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)

  item.innerHTML = `
    <div class="team-header">
      <div class="team-info">
        <div class="team-avatar">${teamInitials}</div>
        <div class="team-details">
          <h3>${team.team_name}</h3>
          <div class="team-username">@${team.username}</div>
        </div>
      </div>
      <div class="team-status ${team.status}">${team.status === "active" ? "Hoạt động" : "Không hoạt động"}</div>
    </div>
    <div class="team-members">
      <span>👥</span>
      <span>${team.members} thành viên</span>
    </div>
  `

  return item
}

// Show beach detail view
function showBeachDetail(beachId) {
  currentView = "beach"
  currentBeach = beachId

  const beach = getBeachById(beachId)

  // Update breadcrumb
  document.getElementById("pageTitle").textContent = beach.beach_name
  document.getElementById("locationInfo").style.display = "flex"
  document.getElementById("locationCoords").textContent = `${beach.latitude.toFixed(4)}, ${beach.longitude.toFixed(4)}`
  document.getElementById("backBtn").style.display = "flex"

  // Update descriptions
  document.getElementById("beachDescription").textContent = `Vị trí và trạng thái các team tại ${beach.beach_name}`
  document.getElementById("teamListDescription").textContent = `Các team hoạt động tại ${beach.beach_name}`

  // Hide overview, show beach dashboard
  document.getElementById("overviewDashboard").style.display = "none"
  document.getElementById("beachDashboard").style.display = "block"

  // Initialize team map and load team list
  initializeTeamMap(beachId)
  loadTeamList(beachId)
}

// Go back navigation
function goBack() {
  if (currentView === "beach") {
    currentView = "overview"
    currentBeach = null

    // Update breadcrumb
    document.getElementById("pageTitle").textContent = "Tổng quan hệ thống"
    document.getElementById("locationInfo").style.display = "none"
    document.getElementById("backBtn").style.display = "none"

    // Show overview dashboard
    document.getElementById("overviewDashboard").style.display = "block"
    document.getElementById("beachDashboard").style.display = "none"
  }
}

// Update statistics
function updateStats() {
  const totalBeaches = DATABASE.beaches.length
  const totalTeams = DATABASE.teams.length
  const activeDrones = 12 // From database
  const todayAlerts = 3 // Mock data

  document.getElementById("totalBeaches").textContent = totalBeaches
  document.getElementById("totalTeams").textContent = totalTeams
  document.getElementById("activeDrones").textContent = activeDrones
  document.getElementById("todayAlerts").textContent = todayAlerts
}

// Modal functions
function openAddBeachModal() {
  document.getElementById("addBeachModal").style.display = "block"
}

function closeAddBeachModal() {
  document.getElementById("addBeachModal").style.display = "none"
  document.getElementById("addBeachForm").reset()
}

function openAddTeamModal() {
  if (!currentBeach) {
    alert("Vui lòng chọn một bãi biển trước!")
    return
  }
  document.getElementById("addTeamModal").style.display = "block"
}

function closeAddTeamModal() {
  document.getElementById("addTeamModal").style.display = "none"
  document.getElementById("addTeamForm").reset()
}

// Form submissions
document.getElementById("addBeachForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const newBeach = {
    beach_id: generateId(),
    beach_name: formData.get("beachName"),
    latitude: Number.parseFloat(formData.get("latitude")),
    longitude: Number.parseFloat(formData.get("longitude")),
    status: "active",
    manager_id: "MNG001",
  }

  DATABASE.beaches.push(newBeach)
  loadBeachList()
  updateStats()

  // Update map
  const marker = L.marker([newBeach.latitude, newBeach.longitude])
    .addTo(overviewMap)
    .bindPopup(`
      <div class="popup-content">
        <h3>${newBeach.beach_name}</h3>
        <p>0 teams • 0 thành viên</p>
      </div>
    `)

  marker.on("click", () => {
    showBeachDetail(newBeach.beach_id)
  })

  closeAddBeachModal()
  alert("Thêm bãi biển thành công!")
})

document.getElementById("addTeamForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const beach = getBeachById(currentBeach)

  const newTeam = {
    team_id: generateId(),
    team_name: formData.get("teamName"),
    beach_id: currentBeach,
    username: formData.get("teamUsername"),
    status: "active",
    latitude: beach.latitude + (Math.random() - 0.5) * 0.01,
    longitude: beach.longitude + (Math.random() - 0.5) * 0.01,
    members: Math.floor(Math.random() * 5) + 3,
  }

  DATABASE.teams.push(newTeam)
  loadTeamList(currentBeach)
  updateStats()

  // Update team map
  initializeTeamMap(currentBeach)

  closeAddTeamModal()
  alert("Tạo team thành công!")
})

// Logout function
function logout() {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("userRole")
  window.location.href = "../login.html"
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  const addBeachModal = document.getElementById("addBeachModal")
  const addTeamModal = document.getElementById("addTeamModal")

  if (e.target === addBeachModal) {
    closeAddBeachModal()
  }
  if (e.target === addTeamModal) {
    closeAddTeamModal()
  }
})

// Handle responsive map resize
function handleResize() {
  if (overviewMap) {
    setTimeout(() => overviewMap.invalidateSize(), 100)
  }
  if (teamMap) {
    setTimeout(() => teamMap.invalidateSize(), 100)
  }
}

window.addEventListener("resize", handleResize)

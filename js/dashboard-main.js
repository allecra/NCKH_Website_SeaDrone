// Global variables
let overviewMap, teamMap
let currentView = "overview"
let currentBeach = null
let currentTeam = null

// Declare variables
const L = window.L // Assuming Leaflet is loaded globally
const DATABASE = window.DATABASE // Assuming DATABASE is loaded globally
const getBeachStats = window.getBeachStats // Assuming getBeachStats is loaded globally
const getBeachById = window.getBeachById // Assuming getBeachById is loaded globally
const getTeamsByBeachId = window.getTeamsByBeachId // Assuming getTeamsByBeachId is loaded globally
const getTeamStats = window.getTeamStats // Assuming getTeamStats is loaded globally
const getUsersByTeamId = window.getUsersByTeamId // Assuming getUsersByTeamId is loaded globally
const getTeamById = window.getTeamById // Assuming getTeamById is loaded globally

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeOverviewMap()
  loadBeachList()
  setupEventListeners()
})

// Setup event listeners
function setupEventListeners() {
  const backBtn = document.getElementById("backBtn")
  const issuesClose = document.querySelector(".issues-close")

  backBtn.addEventListener("click", handleBackNavigation)
  issuesClose.addEventListener("click", () => {
    document.getElementById("issuesNotification").style.display = "none"
  })
}

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
    const stats = getTeamStats(team.team_id)
    const iconColor = team.status === "active" ? "#0066cc" : "#fdcb6e"

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
          <p>${stats.totalMembers} thành viên • ${stats.activeDrones} drone hoạt động</p>
        </div>
      `)

    marker.on("click", () => {
      showTeamDetail(team.team_id)
    })
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
      <div class="beach-status ${beach.status}">${beach.status === "active" ? "Hoạt động" : "Không hoạt động"}</div>
    </div>
    <div class="beach-stats">
      <div class="stat-item">
        <span class="stat-icon">👥</span>
        <span>${stats.totalTeams} teams</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🏃</span>
        <span>${stats.totalMembers} thành viên</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🚁</span>
        <span>${stats.totalDrones} drones</span>
      </div>
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
    const stats = getTeamStats(team.team_id)
    const teamItem = createTeamItem(team, stats)
    teamList.appendChild(teamItem)
  })
}

// Create team item element
function createTeamItem(team, stats) {
  const item = document.createElement("div")
  item.className = "team-item"
  item.onclick = () => showTeamDetail(team.team_id)

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
      <span class="stat-icon">👥</span>
      <span>${stats.totalMembers} thành viên</span>
    </div>
  `

  return item
}

// Load team members
function loadTeamMembers(teamId) {
  const membersGrid = document.getElementById("membersGrid")
  const members = getUsersByTeamId(teamId)

  membersGrid.innerHTML = ""

  members.forEach((member) => {
    const memberCard = createMemberCard(member)
    membersGrid.appendChild(memberCard)
  })
}

// Create member card element
function createMemberCard(member) {
  const card = document.createElement("div")
  card.className = "member-card"

  const initials = member.fullname
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
  const roleText = member.role === "technical_monitor" ? "Technical Monitor" : "Cứu hộ viên"

  card.innerHTML = `
    <div class="member-header">
      <div class="member-avatar">${initials}</div>
      <div class="member-info">
        <h3>${member.fullname}</h3>
        <div class="member-role ${member.role}">${roleText}</div>
      </div>
    </div>
    <div class="member-details">
      <div class="member-detail">
        <span class="detail-icon">📞</span>
        <span>${member.phone}</span>
      </div>
      <div class="member-detail">
        <span class="detail-icon">✉️</span>
        <span>${member.email}</span>
      </div>
      <div class="member-detail">
        <span class="detail-icon">📍</span>
        <span>${member.address}</span>
      </div>
    </div>
  `

  return card
}

// Show beach detail view
function showBeachDetail(beachId) {
  currentView = "beach"
  currentBeach = beachId

  const beach = getBeachById(beachId)

  // Update breadcrumb
  document.getElementById("breadcrumbText").textContent = beach.beach_name
  document.getElementById("locationInfo").style.display = "flex"
  document.getElementById("locationCoords").textContent = `${beach.latitude.toFixed(4)}, ${beach.longitude.toFixed(4)}`
  document.getElementById("backBtn").style.display = "flex"

  // Update description
  document.getElementById("beachDescription").textContent = `Vị trí và trạng thái các team tại ${beach.beach_name}`

  // Hide overview, show beach dashboard
  document.getElementById("overviewDashboard").style.display = "none"
  document.getElementById("beachDashboard").style.display = "block"
  document.getElementById("teamDashboard").style.display = "none"

  // Initialize team map and load team list
  initializeTeamMap(beachId)
  loadTeamList(beachId)
}

// Show team detail view
function showTeamDetail(teamId) {
  currentView = "team"
  currentTeam = teamId

  const team = getTeamById(teamId)
  const beach = getBeachById(team.beach_id)

  // Update breadcrumb
  document.getElementById("breadcrumbText").textContent = `${beach.beach_name} > ${team.team_name}`
  document.getElementById("locationInfo").style.display = "none"
  document.getElementById("backBtn").style.display = "flex"

  // Update title
  document.getElementById("teamDetailTitle").textContent = `Thông tin thành viên ${team.team_name}`

  // Hide other views, show team dashboard
  document.getElementById("overviewDashboard").style.display = "none"
  document.getElementById("beachDashboard").style.display = "none"
  document.getElementById("teamDashboard").style.display = "block"

  // Load team members
  loadTeamMembers(teamId)
}

// Handle back navigation
function handleBackNavigation() {
  if (currentView === "team") {
    // Go back to beach view
    showBeachDetail(currentBeach)
  } else if (currentView === "beach") {
    // Go back to overview
    currentView = "overview"
    currentBeach = null
    currentTeam = null

    // Update breadcrumb
    document.getElementById("breadcrumbText").textContent = "Tổng quan hệ thống"
    document.getElementById("locationInfo").style.display = "none"
    document.getElementById("backBtn").style.display = "none"

    // Show overview dashboard
    document.getElementById("overviewDashboard").style.display = "block"
    document.getElementById("beachDashboard").style.display = "none"
    document.getElementById("teamDashboard").style.display = "none"
  }
}

// Utility function to handle responsive map resize
function handleResize() {
  if (overviewMap) {
    setTimeout(() => overviewMap.invalidateSize(), 100)
  }
  if (teamMap) {
    setTimeout(() => teamMap.invalidateSize(), 100)
  }
}

window.addEventListener("resize", handleResize)

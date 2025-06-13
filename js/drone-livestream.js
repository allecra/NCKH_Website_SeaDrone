// Drone livestream page

function getUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize map placeholder
  initMap()

  // Load drone info
  loadDroneInfo()

  // Load detection history
  loadDetectionHistory()

  // Start stream button
  const startStreamBtn = document.getElementById("startStreamBtn")
  if (startStreamBtn) {
    startStreamBtn.addEventListener("click", () => {
      startStream()
    })
  }

  // Stop stream button
  const stopStreamBtn = document.getElementById("stopStreamBtn")
  if (stopStreamBtn) {
    stopStreamBtn.addEventListener("click", () => {
      stopStream()
    })
  }
})

// Initialize map placeholder
function initMap() {
  const mapElement = document.getElementById("map")
  if (mapElement) {
    mapElement.textContent = "Map View"
  }
}

// Load drone info
function loadDroneInfo() {
  const params = getUrlParams()
  const droneId = params.droneId

  if (!droneId) {
    alert("Drone ID is missing")
    return
  }

  const drones = JSON.parse(localStorage.getItem("drones") || "[]")
  const drone = drones.find((d) => d.id === droneId)

  if (!drone) {
    alert("Drone not found")
    return
  }

  // Update drone name in title
  const droneNameTitle = document.getElementById("droneNameTitle")
  if (droneNameTitle) {
    droneNameTitle.textContent = drone.name
  }
}

// Load detection history
function loadDetectionHistory() {
  const params = getUrlParams()
  const droneId = params.droneId

  if (!droneId) return

  const detections = JSON.parse(localStorage.getItem("detections") || "[]")
  const droneDetections = detections.filter((d) => d.droneId === droneId)
  const detectionList = document.getElementById("detectionList")

  if (detectionList) {
    detectionList.innerHTML = ""

    if (droneDetections.length === 0) {
      detectionList.innerHTML = '<div class="no-detections">No detections yet</div>'
      return
    }

    // Sort by timestamp descending
    droneDetections.sort((a, b) => b.timestamp - a.timestamp)

    droneDetections.forEach((detection) => {
      const detectionItem = document.createElement("div")
      detectionItem.className = "detection-item"

      const date = new Date(detection.timestamp)
      const formattedTime = date.toLocaleTimeString()

      detectionItem.innerHTML = `
                <div class="detection-time">${formattedTime}</div>
                <div class="detection-location">Lat: ${detection.lat.toFixed(6)}, Lng: ${detection.lng.toFixed(6)}</div>
            `

      detectionList.appendChild(detectionItem)
    })
  }
}

// Start stream
function startStream() {
  const params = getUrlParams()
  const droneId = params.droneId

  if (!droneId) return

  // Update video placeholder
  const videoFeed = document.getElementById("videoFeed")
  if (videoFeed) {
    videoFeed.innerHTML = '<div class="video-placeholder-text">Live Stream Active</div>'
    videoFeed.classList.add("active")
  }

  // Simulate detections
  simulateDetections(droneId)

  alert("Stream started")
}

// Stop stream
function stopStream() {
  // Update video placeholder
  const videoFeed = document.getElementById("videoFeed")
  if (videoFeed) {
    videoFeed.innerHTML = '<div class="video-placeholder-text">Video Feed</div>'
    videoFeed.classList.remove("active")
  }

  // Clear detection simulation
  clearTimeout(window.detectionSimulator)

  alert("Stream stopped")
}

// Simulate swimmer detections
function simulateDetections(droneId) {
  // Clear any existing simulation
  clearTimeout(window.detectionSimulator)

  // Add a random detection
  const detection = {
    id: Date.now().toString(),
    droneId: droneId,
    timestamp: Date.now(),
    lat: 21.0 + Math.random() * 0.01,
    lng: 105.8 + Math.random() * 0.01,
  }

  const detections = JSON.parse(localStorage.getItem("detections") || "[]")
  detections.push(detection)
  localStorage.setItem("detections", JSON.stringify(detections))

  // Reload detection history
  loadDetectionHistory()

  // Schedule next detection
  const delay = 5000 + Math.random() * 10000 // Random delay between 5-15 seconds
  window.detectionSimulator = setTimeout(() => {
    simulateDetections(droneId)
  }, delay)
}

// Drones management for technical monitor

function getCurrentTeamId() {
  // Placeholder for getting current team ID logic
  return "team123" // Example team ID
}

document.addEventListener("DOMContentLoaded", () => {
  // Load drones data
  loadDrones()

  // Add drone button
  const addDroneBtn = document.getElementById("addDroneBtn")
  if (addDroneBtn) {
    addDroneBtn.addEventListener("click", () => {
      openDroneModal()
    })
  }

  // Drone form submission
  const droneForm = document.getElementById("droneForm")
  if (droneForm) {
    droneForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveDrone()
    })
  }

  // Cancel button
  const cancelDroneBtn = document.getElementById("cancelDroneBtn")
  if (cancelDroneBtn) {
    cancelDroneBtn.addEventListener("click", () => {
      closeDroneModal()
    })
  }

  // Close modal when clicking on X
  const closeModal = document.querySelector(".close-modal")
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      closeDroneModal()
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

// Load drones data
function loadDrones() {
  const teamId = getCurrentTeamId()

  if (!teamId) {
    alert("Team ID could not be determined")
    return
  }

  const drones = JSON.parse(localStorage.getItem("drones") || "[]")
  const teamDrones = drones.filter((drone) => drone.teamId === teamId)
  const tableBody = document.querySelector("#dronesTable tbody")

  if (tableBody) {
    tableBody.innerHTML = ""

    if (teamDrones.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No drones found</td></tr>'
      return
    }

    teamDrones.forEach((drone) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${drone.id}</td>
                <td>${drone.name}</td>
                <td><span class="status-badge status-${drone.status}">${drone.status}</span></td>
                <td>${drone.serialNumber}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-small" onclick="viewLivestream('${drone.id}')">View Livestream</button>
                        <button class="btn btn-small btn-secondary" onclick="editDrone('${drone.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="confirmDeleteDrone('${drone.id}')">Delete</button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)
    })
  }
}

// Open drone modal
function openDroneModal(droneId = null) {
  const modal = document.getElementById("droneModal")
  const modalTitle = document.getElementById("modalTitle")
  const droneIdInput = document.getElementById("droneId")
  const droneNameInput = document.getElementById("droneName")
  const statusInput = document.getElementById("status")
  const serialNumberInput = document.getElementById("serialNumber")

  if (droneId) {
    // Edit mode
    const drones = JSON.parse(localStorage.getItem("drones") || "[]")
    const drone = drones.find((d) => d.id === droneId)

    if (drone) {
      modalTitle.textContent = "Edit Drone"
      droneIdInput.value = drone.id
      droneNameInput.value = drone.name
      statusInput.value = drone.status
      serialNumberInput.value = drone.serialNumber
    }
  } else {
    // Add mode
    modalTitle.textContent = "Add Drone"
    droneIdInput.value = ""
    droneNameInput.value = ""
    statusInput.value = "active"
    serialNumberInput.value = ""
  }

  modal.style.display = "block"
}

// Close drone modal
function closeDroneModal() {
  const modal = document.getElementById("droneModal")
  modal.style.display = "none"
}

// Save drone
function saveDrone() {
  const teamId = getCurrentTeamId()

  if (!teamId) {
    alert("Team ID could not be determined")
    return
  }

  const droneId = document.getElementById("droneId").value
  const droneName = document.getElementById("droneName").value
  const status = document.getElementById("status").value
  const serialNumber = document.getElementById("serialNumber").value

  if (!droneName || !serialNumber) {
    alert("Please fill all required fields")
    return
  }

  const drones = JSON.parse(localStorage.getItem("drones") || "[]")

  if (droneId) {
    // Update existing drone
    const index = drones.findIndex((d) => d.id === droneId)
    if (index !== -1) {
      drones[index].name = droneName
      drones[index].status = status
      drones[index].serialNumber = serialNumber
    }
  } else {
    // Add new drone
    const newDrone = {
      id: Date.now().toString(),
      teamId: teamId,
      name: droneName,
      status: status,
      serialNumber: serialNumber,
    }
    drones.push(newDrone)
  }

  localStorage.setItem("drones", JSON.stringify(drones))
  closeDroneModal()
  loadDrones()
}

// Edit drone
function editDrone(droneId) {
  openDroneModal(droneId)
}

// View livestream
function viewLivestream(droneId) {
  window.location.href = `drone-livestream.html?droneId=${droneId}`
}

// Confirm delete drone
function confirmDeleteDrone(droneId) {
  const deleteModal = document.getElementById("deleteModal")
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")

  // Set up delete confirmation
  confirmDeleteBtn.onclick = () => {
    deleteDrone(droneId)
    closeDeleteModal()
  }

  deleteModal.style.display = "block"
}

// Close delete modal
function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal")
  deleteModal.style.display = "none"
}

// Delete drone
function deleteDrone(droneId) {
  let drones = JSON.parse(localStorage.getItem("drones") || "[]")
  drones = drones.filter((d) => d.id !== droneId)
  localStorage.setItem("drones", JSON.stringify(drones))

  // Also delete related detections
  let detections = JSON.parse(localStorage.getItem("detections") || "[]")
  detections = detections.filter((d) => d.droneId !== droneId)
  localStorage.setItem("detections", JSON.stringify(detections))

  loadDrones()
}

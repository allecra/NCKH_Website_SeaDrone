// Surveys management for technical monitor

function getCurrentTeamId() {
  // Placeholder for getting current team ID
  return "team123" // Replace with actual logic to get team ID
}

document.addEventListener("DOMContentLoaded", () => {
  // Load surveys data
  loadSurveys()

  // Add survey button
  const addSurveyBtn = document.getElementById("addSurveyBtn")
  if (addSurveyBtn) {
    addSurveyBtn.addEventListener("click", () => {
      openSurveyModal()
    })
  }

  // Survey form submission
  const surveyForm = document.getElementById("surveyForm")
  if (surveyForm) {
    surveyForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveSurvey()
    })
  }

  // Cancel button
  const cancelSurveyBtn = document.getElementById("cancelSurveyBtn")
  if (cancelSurveyBtn) {
    cancelSurveyBtn.addEventListener("click", () => {
      closeSurveyModal()
    })
  }

  // Close modal when clicking on X
  const closeModal = document.querySelector(".close-modal")
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      closeSurveyModal()
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

// Load surveys data
function loadSurveys() {
  const teamId = getCurrentTeamId()

  if (!teamId) {
    alert("Team ID could not be determined")
    return
  }

  const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
  const teamSurveys = surveys.filter((survey) => survey.teamId === teamId)
  const tableBody = document.querySelector("#surveysTable tbody")

  if (tableBody) {
    tableBody.innerHTML = ""

    if (teamSurveys.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No surveys found</td></tr>'
      return
    }

    teamSurveys.forEach((survey) => {
      const row = document.createElement("tr")
      const date = new Date(survey.createdAt)
      const formattedDate = date.toLocaleDateString()

      row.innerHTML = `
                <td>${survey.id}</td>
                <td>${survey.name}</td>
                <td>${formattedDate}</td>
                <td><span class="status-badge status-${survey.status}">${survey.status}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-small btn-secondary" onclick="editSurvey('${survey.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="confirmDeleteSurvey('${survey.id}')">Delete</button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)
    })
  }
}

// Open survey modal
function openSurveyModal(surveyId = null) {
  const modal = document.getElementById("surveyModal")
  const modalTitle = document.getElementById("modalTitle")
  const surveyIdInput = document.getElementById("surveyId")
  const surveyNameInput = document.getElementById("surveyName")
  const surveyDescriptionInput = document.getElementById("surveyDescription")

  if (surveyId) {
    // Edit mode
    const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
    const survey = surveys.find((s) => s.id === surveyId)

    if (survey) {
      modalTitle.textContent = "Edit Survey"
      surveyIdInput.value = survey.id
      surveyNameInput.value = survey.name
      surveyDescriptionInput.value = survey.description
    }
  } else {
    // Add mode
    modalTitle.textContent = "Add Survey"
    surveyIdInput.value = ""
    surveyNameInput.value = ""
    surveyDescriptionInput.value = ""
  }

  modal.style.display = "block"
}

// Close survey modal
function closeSurveyModal() {
  const modal = document.getElementById("surveyModal")
  modal.style.display = "none"
}

// Save survey
function saveSurvey() {
  const teamId = getCurrentTeamId()

  if (!teamId) {
    alert("Team ID could not be determined")
    return
  }

  const surveyId = document.getElementById("surveyId").value
  const surveyName = document.getElementById("surveyName").value
  const surveyDescription = document.getElementById("surveyDescription").value

  if (!surveyName || !surveyDescription) {
    alert("Please fill all required fields")
    return
  }

  const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")

  if (surveyId) {
    // Update existing survey
    const index = surveys.findIndex((s) => s.id === surveyId)
    if (index !== -1) {
      surveys[index].name = surveyName
      surveys[index].description = surveyDescription
    }
  } else {
    // Add new survey
    const newSurvey = {
      id: Date.now().toString(),
      teamId: teamId,
      name: surveyName,
      description: surveyDescription,
      createdAt: Date.now(),
      status: "pending",
    }
    surveys.push(newSurvey)
  }

  localStorage.setItem("surveys", JSON.stringify(surveys))
  closeSurveyModal()
  loadSurveys()
}

// Edit survey
function editSurvey(surveyId) {
  openSurveyModal(surveyId)
}

// Confirm delete survey
function confirmDeleteSurvey(surveyId) {
  const deleteModal = document.getElementById("deleteModal")
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")

  // Set up delete confirmation
  confirmDeleteBtn.onclick = () => {
    deleteSurvey(surveyId)
    closeDeleteModal()
  }

  deleteModal.style.display = "block"
}

// Close delete modal
function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal")
  deleteModal.style.display = "none"
}

// Delete survey
function deleteSurvey(surveyId) {
  let surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
  surveys = surveys.filter((s) => s.id !== surveyId)
  localStorage.setItem("surveys", JSON.stringify(surveys))

  loadSurveys()
}

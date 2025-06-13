// Members management

function getUrlParams() {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

document.addEventListener("DOMContentLoaded", () => {
  // Load members data
  loadMembers()

  // Add member button
  const addMemberBtn = document.getElementById("addMemberBtn")
  if (addMemberBtn) {
    addMemberBtn.addEventListener("click", () => {
      openMemberModal()
    })
  }

  // Member form submission
  const memberForm = document.getElementById("memberForm")
  if (memberForm) {
    memberForm.addEventListener("submit", (e) => {
      e.preventDefault()
      saveMember()
    })
  }

  // Cancel button
  const cancelMemberBtn = document.getElementById("cancelMemberBtn")
  if (cancelMemberBtn) {
    cancelMemberBtn.addEventListener("click", () => {
      closeMemberModal()
    })
  }

  // Close modal when clicking on X
  const closeModal = document.querySelector(".close-modal")
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      closeMemberModal()
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

// Load members data
function loadMembers() {
  const params = getUrlParams()
  const teamId = params.teamId

  if (!teamId) {
    alert("Team ID is missing")
    return
  }

  const members = JSON.parse(localStorage.getItem("members") || "[]")
  const teamMembers = members.filter((member) => member.teamId === teamId)
  const tableBody = document.querySelector("#membersTable tbody")

  if (tableBody) {
    tableBody.innerHTML = ""

    if (teamMembers.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No members found</td></tr>'
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
                        <button class="btn btn-small btn-secondary" onclick="editMember('${member.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="confirmDeleteMember('${member.id}')">Delete</button>
                    </div>
                </td>
            `
      tableBody.appendChild(row)
    })
  }
}

// Open member modal
function openMemberModal(memberId = null) {
  const modal = document.getElementById("memberModal")
  const modalTitle = document.getElementById("modalTitle")
  const memberIdInput = document.getElementById("memberId")
  const fullNameInput = document.getElementById("fullName")
  const phoneInput = document.getElementById("phone")
  const emailInput = document.getElementById("email")
  const addressInput = document.getElementById("address")
  const roleInput = document.getElementById("role")

  if (memberId) {
    // Edit mode
    const members = JSON.parse(localStorage.getItem("members") || "[]")
    const member = members.find((m) => m.id === memberId)

    if (member) {
      modalTitle.textContent = "Edit Member"
      memberIdInput.value = member.id
      fullNameInput.value = member.fullName
      phoneInput.value = member.phone
      emailInput.value = member.email
      addressInput.value = member.address
      roleInput.value = member.role
    }
  } else {
    // Add mode
    modalTitle.textContent = "Add Member"
    memberIdInput.value = ""
    fullNameInput.value = ""
    phoneInput.value = ""
    emailInput.value = ""
    addressInput.value = ""
    roleInput.value = "rescuer"
  }

  modal.style.display = "block"
}

// Close member modal
function closeMemberModal() {
  const modal = document.getElementById("memberModal")
  modal.style.display = "none"
}

// Save member
function saveMember() {
  const params = getUrlParams()
  const teamId = params.teamId

  if (!teamId) {
    alert("Team ID is missing")
    return
  }

  const memberId = document.getElementById("memberId").value
  const fullName = document.getElementById("fullName").value
  const phone = document.getElementById("phone").value
  const email = document.getElementById("email").value
  const address = document.getElementById("address").value
  const role = document.getElementById("role").value

  if (!fullName || !phone || !email || !address) {
    alert("Please fill all required fields")
    return
  }

  const members = JSON.parse(localStorage.getItem("members") || "[]")

  if (memberId) {
    // Update existing member
    const index = members.findIndex((m) => m.id === memberId)
    if (index !== -1) {
      members[index].fullName = fullName
      members[index].phone = phone
      members[index].email = email
      members[index].address = address
      members[index].role = role
    }
  } else {
    // Add new member
    const newMember = {
      id: Date.now().toString(),
      teamId: teamId,
      fullName: fullName,
      phone: phone,
      email: email,
      address: address,
      role: role,
    }
    members.push(newMember)
  }

  localStorage.setItem("members", JSON.stringify(members))
  closeMemberModal()
  loadMembers()
}

// Edit member
function editMember(memberId) {
  openMemberModal(memberId)
}

// View member details
function viewMemberDetails(memberId) {
  const params = getUrlParams()
  window.location.href = `member-details.html?beachId=${params.beachId}&teamId=${params.teamId}&memberId=${memberId}`
}

// Confirm delete member
function confirmDeleteMember(memberId) {
  const deleteModal = document.getElementById("deleteModal")
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")

  // Set up delete confirmation
  confirmDeleteBtn.onclick = () => {
    deleteMember(memberId)
    closeDeleteModal()
  }

  deleteModal.style.display = "block"
}

// Close delete modal
function closeDeleteModal() {
  const deleteModal = document.getElementById("deleteModal")
  deleteModal.style.display = "none"
}

// Delete member
function deleteMember(memberId) {
  let members = JSON.parse(localStorage.getItem("members") || "[]")
  members = members.filter((m) => m.id !== memberId)
  localStorage.setItem("members", JSON.stringify(members))

  loadMembers()
}

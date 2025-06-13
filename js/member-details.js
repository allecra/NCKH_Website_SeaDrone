// Member details page

function getUrlParams() {
  const params = {}
  window.location.search
    .substring(1)
    .split("&")
    .forEach((param) => {
      const [key, value] = param.split("=")
      params[key] = decodeURIComponent(value)
    })
  return params
}

document.addEventListener("DOMContentLoaded", () => {
  // Load member details
  loadMemberDetails()

  // Save member button
  const saveMemberBtn = document.getElementById("saveMemberBtn")
  if (saveMemberBtn) {
    saveMemberBtn.addEventListener("click", () => {
      saveMemberDetails()
    })
  }
})

// Load member details
function loadMemberDetails() {
  const params = getUrlParams()
  const memberId = params.memberId

  if (!memberId) {
    alert("Member ID is missing")
    return
  }

  const members = JSON.parse(localStorage.getItem("members") || "[]")
  const member = members.find((m) => m.id === memberId)

  if (!member) {
    alert("Member not found")
    return
  }

  // Fill form fields
  document.getElementById("memberId").value = member.id
  document.getElementById("fullName").value = member.fullName
  document.getElementById("phone").value = member.phone
  document.getElementById("email").value = member.email
  document.getElementById("address").value = member.address
  document.getElementById("role").value = member.role

  // Update member name in title
  const memberNameTitle = document.getElementById("memberNameTitle")
  if (memberNameTitle) {
    memberNameTitle.textContent = member.fullName
  }
}

// Save member details
function saveMemberDetails() {
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
  const index = members.findIndex((m) => m.id === memberId)

  if (index !== -1) {
    members[index].fullName = fullName
    members[index].phone = phone
    members[index].email = email
    members[index].address = address
    members[index].role = role

    localStorage.setItem("members", JSON.stringify(members))
    alert("Member details saved successfully")

    // Update member name in title
    const memberNameTitle = document.getElementById("memberNameTitle")
    if (memberNameTitle) {
      memberNameTitle.textContent = fullName
    }
  } else {
    alert("Member not found")
  }
}

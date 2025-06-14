// View member details page for technical monitor (read-only)

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

  // Fill readonly fields
  document.getElementById("fullName").textContent = member.fullName
  document.getElementById("phone").textContent = member.phone
  document.getElementById("email").textContent = member.email
  document.getElementById("address").textContent = member.address
  document.getElementById("role").textContent = member.role === "rescuer" ? "Rescuer" : "Technical Monitor"

  // Update member name in title
  const memberNameTitle = document.getElementById("memberNameTitle")
  if (memberNameTitle) {
    memberNameTitle.textContent = member.fullName
  }
}

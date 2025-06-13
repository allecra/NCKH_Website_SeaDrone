// Authentication related functions

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const accountType = document.getElementById("accountType").value
      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      // Simple authentication check
      if (accountType === "admin" && username === "admin" && password === "admin123") {
        localStorage.setItem("currentUser", username)
        localStorage.setItem("userRole", "admin")
        window.location.href = "admin/admin-dashboard.html"
      } else if (accountType === "monitor" && username === "team_nt_alpha" && password === "team123") {
        localStorage.setItem("currentUser", username)
        localStorage.setItem("userRole", "technical_monitor")
        window.location.href = "technical-monitor/dashboard.html"
      } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!")
      }
    })
  }

  // Handle logout cho cả class logout-btn
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userRole');
      window.location.href = '../login.html';
    });
  });

  // Check authentication on page load
  checkAuth()
})

// Check if user is logged in
function checkAuth() {
  const currentUser = localStorage.getItem("currentUser")
  const userRole = localStorage.getItem("userRole")

  if (!currentUser || !userRole) {
    // Redirect to login page if not logged in
    if (!window.location.pathname.endsWith("/login.html")) {
      window.location.href = "/login.html"
    }
    return false
  }

  // Update user info in header
  const userInfoElement = document.getElementById("currentUser")
  if (userInfoElement) {
    userInfoElement.textContent = currentUser
  }

  // Check if user is on the correct dashboard based on role
  const currentPath = window.location.pathname
  if (userRole === "admin" && currentPath.includes("/technical-monitor/")) {
    window.location.href = "/admin/admin-dashboard.html"
    return false
  } else if (userRole === "technical_monitor" && currentPath.includes("/admin/")) {
    window.location.href = "/technical-monitor/dashboard.html"
    return false
  }

  return true
} 
// Authentication related functions

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.onsubmit = async function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Nếu là tài khoản tester thì chuyển hướng sang web API cổng 5008
      if (username === 'tester' && password === 'test123') {
        window.location.href = 'http://localhost:5008';
        return;
      }

      const res = await fetch("http://localhost:3009/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "../admin/admin-dashboard.html";
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    };
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
    window.location.href = "../admin/admin-dashboard.html"
    return false
  } else if (userRole === "technical_monitor" && currentPath.includes("/admin/")) {
    window.location.href = "../technical-monitor/dashboard.html"
    return false
  }
}
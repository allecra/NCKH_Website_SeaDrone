// Authentication related functions

// Handle login form submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.onsubmit = async function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
<<<<<<< HEAD
      const accountType = document.getElementById('accountType').value;
=======
>>>>>>> admin

      // Nếu là tài khoản tester thì chuyển hướng sang web API cổng 5008
      if (username === 'tester' && password === 'test123') {
        window.location.href = 'http://localhost:5008';
        return;
      }

<<<<<<< HEAD
      //if (username === 'team_nt_alpha' && password === 'team123') {
       // window.location.href = 'http://localhost:3005';
       // return;
      //}

      //if (username === 'admin' && password === 'admin123') {
      //  window.location.href = 'http://localhost:3009';
      //  return;
      //}

      const res = await fetch("http://localhost:3005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, accountType })
      });
      const data = await res.json();
      if (res.ok) {
        // Giả sử API trả về role
        localStorage.setItem('currentUser', data.username || username);
        localStorage.setItem('userRole', data.role || 'technical_monitor');
        localStorage.setItem('userId', data.user_id || '');
        localStorage.setItem('teamId', data.team_id || '');
        if ((data.role || 'technical_monitor') === 'admin') {
          window.location.href = "../admin/admin-dashboard.html";
        } else {
          window.location.href = `../technical-monitor/dashboard.html`;
        }
=======
      const res = await fetch("http://localhost:3009/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "../admin/admin-dashboard.html";
>>>>>>> admin
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
      localStorage.removeItem('userId');
      localStorage.removeItem('teamId');
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
  const teamId = localStorage.getItem("teamId")

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
<<<<<<< HEAD
=======
    return false
  } else if (userRole === "technical_monitor" && currentPath.includes("/admin/")) {
    window.location.href = "../technical-monitor/dashboard.html"
>>>>>>> admin
    return false
  } else if ((userRole === "technical_monitor" || userRole === "monitor") && currentPath.includes("/admin/")) {
    window.location.href = `../technical-monitor/team-members.html?team_id=${teamId}`;
    return false;
  }
}
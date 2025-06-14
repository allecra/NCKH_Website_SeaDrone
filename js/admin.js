// Admin specific functions

// Get current user info
const currentUser = localStorage.getItem("currentUser")
const userRole = localStorage.getItem("userRole")

if (!currentUser || userRole !== "admin") {
    window.location.href = "../login.html"
    return
}

// Update user info in header
document.querySelector(".user-controls span").textContent = `👤 ${currentUser}`

// Xử lý đăng xuất
document.querySelector('.logout-btn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    window.location.href = '../login.html';
});

// Initialize map
function initializeMap() {
    // Create map centered on Vietnam
    const map = L.map('beachMap').setView([14.0583, 108.2772], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each beach
    DATABASE.beaches.forEach(beach => {
        const marker = L.marker([beach.latitude, beach.longitude])
            .bindPopup(`
                <h3>${beach.beach_name}</h3>
                <p>👥 ${beach.total_teams} teams cứu hộ</p>
                <button onclick="window.location.href='teams.html?beach_id=${beach.beach_id}'" style="
                    background: #0077b6;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-top: 5px;
                ">Xem chi tiết</button>
            `)
            .addTo(map);

        // Add click event to marker
        marker.on('click', () => {
            map.setView([beach.latitude, beach.longitude], 12);
        });
    });
}

// Initialize data and map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeMap();
});

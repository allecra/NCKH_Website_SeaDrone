// Import data from admin-data.js
import { DATABASE, getTeamsByBeachId, getBeachById, getTeamById, getBeachStats, getMembersByTeamId } from './admin-data.js';

// Hiển thị danh sách bãi biển
function displayBeaches() {
    const beachList = document.querySelector('.beach-list');
    if (!beachList) return;

    beachList.innerHTML = DATABASE.beaches.map(beach => {
        const stats = getBeachStats(beach.beach_id);
        return `
            <div class="beach-item" data-beach-id="${beach.beach_id}">
                <div class="beach-header">
                    <h3 class="beach-name">${beach.beach_name}</h3>
                    <span class="beach-status ${beach.status}">${beach.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</span>
                </div>
                <div class="beach-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${beach.latitude}, ${beach.longitude}</span>
                </div>
                <div class="beach-description">
                    <p>${beach.description}</p>
                </div>
                <div class="beach-stats">
                    <div class="stat-item">
                        <i class="fas fa-users stat-icon"></i>
                        <span>${stats.totalTeams} đội</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-user-check stat-icon"></i>
                        <span>${stats.activeTeams} đội hoạt động</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-user-friends stat-icon"></i>
                        <span>${stats.totalMembers} thành viên</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Thêm sự kiện click cho các bãi biển
    beachList.querySelectorAll('.beach-item').forEach(item => {
        item.addEventListener('click', () => {
            const beachId = item.dataset.beachId;
            window.location.href = `teams.html?beach_id=${beachId}`;
        });
    });
}

// Hiển thị thông tin chi tiết bãi biển
function displayBeachDetails(beachId) {
    const beach = getBeachById(beachId);
    if (!beach) return;

    const beachDetails = document.querySelector('.beach-details');
    if (!beachDetails) return;

    const stats = getBeachStats(beachId);
    beachDetails.innerHTML = `
        <div class="content-header">
            <div>
                <h1>${beach.beach_name}</h1>
                <p class="beach-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${beach.latitude}, ${beach.longitude}
                </p>
            </div>
            <div class="beach-status ${beach.status}">
                ${beach.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </div>
        </div>
        <div class="beach-description">
            <p>${beach.description}</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="icon teams">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${stats.totalTeams}</h3>
                    <p>Tổng số đội</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="icon teams">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-info">
                    <h3>${stats.activeTeams}</h3>
                    <p>Đội hoạt động</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="icon members">
                    <i class="fas fa-user-friends"></i>
                </div>
                <div class="stat-info">
                    <h3>${stats.totalMembers}</h3>
                    <p>Tổng thành viên</p>
                </div>
            </div>
        </div>
    `;
}

// Hiển thị danh sách đội cứu hộ
function displayTeams(beachId) {
    const teamsList = document.querySelector('.teams-list');
    if (!teamsList) return;

    const teams = getTeamsByBeachId(beachId);
    teamsList.innerHTML = teams.map(team => `
        <div class="team-item" data-team-id="${team.team_id}">
            <div class="team-header">
                <div class="team-info">
                    <h3>${team.team_name}</h3>
                    <span class="team-username">@${team.username}</span>
                </div>
                <span class="team-status ${team.status}">
                    ${team.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                </span>
            </div>
            <div class="team-description">
                <p>${team.description}</p>
            </div>
            <div class="team-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${team.schedule}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tools"></i>
                    <span>${team.equipment.join(', ')}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${team.members} thành viên</span>
                </div>
            </div>
        </div>
    `).join('');

    // Thêm sự kiện click cho các đội
    teamsList.querySelectorAll('.team-item').forEach(item => {
        item.addEventListener('click', () => {
            const teamId = item.dataset.teamId;
            window.location.href = `members.html?team_id=${teamId}`;
        });
    });
}

// Hiển thị thông tin chi tiết đội cứu hộ
function displayTeamDetails(teamId) {
    const team = getTeamById(teamId);
    if (!team) return;

    const teamDetails = document.querySelector('.team-details');
    if (!teamDetails) return;

    const beach = getBeachById(team.beach_id);
    const members = getMembersByTeamId(teamId);

    teamDetails.innerHTML = `
        <div class="content-header">
            <div>
                <h1>${team.team_name}</h1>
                <p class="team-username">@${team.username}</p>
            </div>
            <div class="team-status ${team.status}">
                ${team.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
            </div>
        </div>
        <div class="team-description">
            <p>${team.description}</p>
        </div>
        <div class="team-info-grid">
            <div class="info-card">
                <h3>Thông tin cơ bản</h3>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${beach.beach_name}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>${team.schedule}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map"></i>
                    <span>${team.latitude}, ${team.longitude}</span>
                </div>
            </div>
            <div class="info-card">
                <h3>Trang thiết bị</h3>
                <div class="equipment-list">
                    ${team.equipment.map(item => `
                        <div class="equipment-item">
                            <i class="fas fa-check"></i>
                            <span>${item}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="info-card">
                <h3>Thành viên (${members.length})</h3>
                <div class="members-list">
                    ${members.map(member => `
                        <div class="member-item">
                            <div class="member-info">
                                <h4>${member.name}</h4>
                                <span class="member-role ${member.role}">
                                    ${member.role === 'technical_monitor' ? 'Giám sát kỹ thuật' : 'Nhân viên cứu hộ'}
                                </span>
                            </div>
                            <div class="member-contact">
                                <a href="tel:${member.phone}">
                                    <i class="fas fa-phone"></i>
                                </a>
                                <a href="mailto:${member.email}">
                                    <i class="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Khởi tạo bản đồ
function initMap() {
    const map = L.map('overviewMap').setView([12.2388, 109.1967], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Thêm markers cho các bãi biển
    DATABASE.beaches.forEach(beach => {
        const stats = getBeachStats(beach.beach_id);
        const marker = L.marker([beach.latitude, beach.longitude])
            .bindPopup(`
                <div class="popup-content">
                    <h3>${beach.beach_name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${beach.latitude}, ${beach.longitude}</p>
                    <p><i class="fas fa-users"></i> ${stats.totalTeams} đội</p>
                    <p><i class="fas fa-user-check"></i> ${stats.activeTeams} đội hoạt động</p>
                    <p><i class="fas fa-user-friends"></i> ${stats.totalMembers} thành viên</p>
                </div>
            `);
        marker.addTo(map);
    });
}

// Export các hàm để sử dụng
export {
    displayBeaches,
    displayBeachDetails,
    displayTeams,
    displayTeamDetails,
    initMap,
    getTeamsByBeachId
}; 
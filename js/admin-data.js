// Database data from the seed script
export const DATABASE = {
  beaches: [
    {
      beach_id: "B002",
      beach_name: "Bãi biển Nha Trang",
      manager_id: "MNG002",
      latitude: 12.2388,
      longitude: 109.1967,
      status: "active",
      description: "Bãi biển Nha Trang nổi tiếng với làn nước trong xanh và bãi cát trắng mịn",
      total_teams: 3,
      total_members: 12
    },
    {
      beach_id: "B003",
      beach_name: "Bãi biển Đà Nẵng",
      manager_id: "MNG003",
      latitude: 16.0544,
      longitude: 108.2022,
      status: "active",
      description: "Bãi biển Đà Nẵng được mệnh danh là một trong những bãi biển đẹp nhất thế giới",
      total_teams: 1,
      total_members: 6
    },
    {
      beach_id: "B004",
      beach_name: "Bãi biển Vũng Tàu",
      manager_id: "MNG001",
      latitude: 10.346,
      longitude: 107.0843,
      status: "active",
      description: "Bãi biển Vũng Tàu nổi tiếng với cảnh đẹp và không khí trong lành",
      total_teams: 1,
      total_members: 4
    },
  ],

  teams: [
    {
      team_id: "T001",
      team_name: "Team Alpha",
      beach_id: "B002",
      username: "team_alpha",
      status: "active",
      latitude: 12.239,
      longitude: 109.1965,
      members: 5,
      description: "Đội cứu hộ chuyên nghiệp tại bãi biển Nha Trang",
      equipment: ["Phao cứu sinh", "Thuyền cứu hộ", "Máy thở"],
      schedule: "24/7"
    },
    {
      team_id: "T002",
      team_name: "Team Beta",
      beach_id: "B002",
      username: "team_beta",
      status: "active",
      latitude: 12.2385,
      longitude: 109.1968,
      members: 3,
      description: "Đội cứu hộ phụ trách khu vực phía Bắc bãi biển",
      equipment: ["Phao cứu sinh", "Thuyền cứu hộ"],
      schedule: "8:00 - 20:00"
    },
    {
      team_id: "T003",
      team_name: "Team Gamma",
      beach_id: "B002",
      username: "team_gamma",
      status: "inactive",
      latitude: 12.24,
      longitude: 109.197,
      members: 4,
      description: "Đội cứu hộ dự bị",
      equipment: ["Phao cứu sinh"],
      schedule: "Dự bị"
    },
    {
      team_id: "T004",
      team_name: "Team Đà Nẵng Alpha",
      beach_id: "B003",
      username: "team_dn_alpha",
      status: "active",
      latitude: 16.0545,
      longitude: 108.202,
      members: 6,
      description: "Đội cứu hộ chính tại bãi biển Đà Nẵng",
      equipment: ["Phao cứu sinh", "Thuyền cứu hộ", "Máy thở", "Drone"],
      schedule: "24/7"
    },
    {
      team_id: "T005",
      team_name: "Team Vũng Tàu Alpha",
      beach_id: "B004",
      username: "team_vt_alpha",
      status: "active",
      latitude: 10.346,
      longitude: 107.0843,
      members: 4,
      description: "Đội cứu hộ tại bãi biển Vũng Tàu",
      equipment: ["Phao cứu sinh", "Thuyền cứu hộ"],
      schedule: "24/7"
    },
  ],

  members: [
    {
      member_id: "M001",
      team_id: "T001",
      name: "Nguyễn Văn A",
      role: "technical_monitor",
      phone: "0123456789",
      email: "nguyenvana@example.com",
      status: "active"
    },
    {
      member_id: "M002",
      team_id: "T001",
      name: "Trần Thị B",
      role: "rescuer",
      phone: "0987654321",
      email: "tranthib@example.com",
      status: "active"
    }
  ]
}

// Helper functions
export function getTeamsByBeachId(beachId) {
  return DATABASE.teams.filter((team) => team.beach_id === beachId)
}

export function getBeachById(beachId) {
  return DATABASE.beaches.find((beach) => beach.beach_id === beachId)
}

export function getTeamById(teamId) {
  return DATABASE.teams.find((team) => team.team_id === teamId)
}

export function getMembersByTeamId(teamId) {
  return DATABASE.members.filter((member) => member.team_id === teamId)
}

export function getBeachStats(beachId) {
  const teams = getTeamsByBeachId(beachId)
  const activeTeams = teams.filter((t) => t.status === "active").length
  const totalMembers = teams.reduce((sum, team) => sum + team.members, 0)

  return {
    totalTeams: teams.length,
    activeTeams,
    totalMembers,
  }
}

export function generateId() {
  return Date.now().toString()
}

// Database data from the seed script
const DATABASE = {
  beaches: [
    {
      beach_id: "B002",
      beach_name: "Bãi biển Nha Trang",
      manager_id: "MNG002",
      latitude: 12.2388,
      longitude: 109.1967,
      status: "active",
    },
    {
      beach_id: "B003",
      beach_name: "Bãi biển Đà Nẵng",
      manager_id: "MNG003",
      latitude: 16.0545,
      longitude: 108.202,
      status: "active",
    },
    {
      beach_id: "B004",
      beach_name: "Bãi biển Vũng Tàu",
      manager_id: "MNG001",
      latitude: 10.346,
      longitude: 107.0843,
      status: "active",
    },
  ],

  teams: [
    {
      team_id: "T001",
      team_name: "Team Nha Trang Alpha",
      beach_id: "B002",
      username: "team_nt_alpha",
      status: "active",
      latitude: 12.239,
      longitude: 109.1965,
    },
    {
      team_id: "T002",
      team_name: "Team Nha Trang Beta",
      beach_id: "B002",
      username: "team_nt_beta",
      status: "active",
      latitude: 12.2385,
      longitude: 109.1968,
    },
    {
      team_id: "T003",
      team_name: "Team Đà Nẵng Alpha",
      beach_id: "B003",
      username: "team_dn_alpha",
      status: "active",
      latitude: 16.0545,
      longitude: 108.202,
    },
    {
      team_id: "T004",
      team_name: "Team Vũng Tàu Alpha",
      beach_id: "B004",
      username: "team_vt_alpha",
      status: "inactive",
      latitude: 10.346,
      longitude: 107.0843,
    },
  ],

  users: [
    {
      user_id: "MNG001",
      fullname: "Nguyễn Thị Tâm",
      phone: "0987654321",
      email: "tamnguyen@gmail.com",
      address: "Nha Trang",
      role: "technical_monitor",
      team_id: "T001",
      avatar: "https://via.placeholder.com/150/0066cc/ffffff?text=NT",
    },
    {
      user_id: "MNG002",
      fullname: "Lê Tuấn Linh",
      phone: "0987654322",
      email: "linhtuan@gmail.com",
      address: "Đà Nẵng",
      role: "technical_monitor",
      team_id: "T002",
      avatar: "https://via.placeholder.com/150/fd79a8/ffffff?text=LT",
    },
    {
      user_id: "MNG003",
      fullname: "Nguyễn Tấn Phát",
      phone: "0987654323",
      email: "phatnguyen@gmail.com",
      address: "Vũng Tàu",
      role: "technical_monitor",
      team_id: "T003",
      avatar: "https://via.placeholder.com/150/00b894/ffffff?text=NP",
    },
    {
      user_id: "RC0001",
      fullname: "Nguyễn Thị Xinh",
      phone: "0987654324",
      email: "xinhnguyen@gmail.com",
      address: "Nha Trang",
      role: "rescuer",
      team_id: "T001",
      avatar: "https://via.placeholder.com/150/e17055/ffffff?text=NX",
    },
    {
      user_id: "RC0002",
      fullname: "Hoàng Văn Đức",
      phone: "0987654325",
      email: "ducnguyen@gmail.com",
      address: "Đà Nẵng",
      role: "rescuer",
      team_id: "T002",
      avatar: "https://via.placeholder.com/150/0984e3/ffffff?text=HD",
    },
    {
      user_id: "RC0003",
      fullname: "Vũ Thị Thi",
      phone: "0987654326",
      email: "thivu@gmail.com",
      address: "Đà Nẵng",
      role: "rescuer",
      team_id: "T003",
      avatar: "https://via.placeholder.com/150/a29bfe/ffffff?text=VT",
    },
    {
      user_id: "RC0004",
      fullname: "Đặng Văn Giáp",
      phone: "0987654327",
      email: "dangvang@gmail.com",
      address: "Vũng Tàu",
      role: "technical_monitor",
      team_id: "T004",
      avatar: "https://via.placeholder.com/150/6c5ce7/ffffff?text=DG",
    },
    {
      user_id: "RC0005",
      fullname: "Bùi Thị Hiền",
      phone: "0987654328",
      email: "buithih@gmail.com",
      address: "Vũng Tàu",
      role: "rescuer",
      team_id: "T004",
      avatar: "https://via.placeholder.com/150/fab1a0/ffffff?text=BH",
    },
  ],

  drones: [
    {
      drone_id: "DRN001",
      drone_name: "Drone Alpha-01",
      serial_number: "DRN-001-NT",
      model: "DJI Mavic 3",
      status: "active",
      team_id: "T001",
      battery_level: 85,
    },
    {
      drone_id: "DRN002",
      drone_name: "Drone Alpha-02",
      serial_number: "DRN-002-NT",
      model: "DJI Mavic 3",
      status: "inactive",
      team_id: "T001",
      battery_level: 45,
    },
    {
      drone_id: "DRN003",
      drone_name: "Drone Beta-01",
      serial_number: "DRN-001-NT-B",
      model: "DJI Air 2S",
      status: "active",
      team_id: "T002",
      battery_level: 92,
    },
    {
      drone_id: "DRN004",
      drone_name: "Drone DN-Alpha-01",
      serial_number: "DRN-001-DN",
      model: "DJI Mavic 3",
      status: "active",
      team_id: "T003",
      battery_level: 78,
    },
    {
      drone_id: "DRN005",
      drone_name: "Drone VT-Alpha-01",
      serial_number: "DRN-001-VT",
      model: "DJI Air 2S",
      status: "active",
      team_id: "T004",
      battery_level: 65,
    },
  ],
}

// Helper functions
function getTeamsByBeachId(beachId) {
  return DATABASE.teams.filter((team) => team.beach_id === beachId)
}

function getUsersByTeamId(teamId) {
  return DATABASE.users.filter((user) => user.team_id === teamId)
}

function getDronesByTeamId(teamId) {
  return DATABASE.drones.filter((drone) => drone.team_id === teamId)
}

function getBeachById(beachId) {
  return DATABASE.beaches.find((beach) => beach.beach_id === beachId)
}

function getTeamById(teamId) {
  return DATABASE.teams.find((team) => team.team_id === teamId)
}

function getTeamStats(teamId) {
  const users = getUsersByTeamId(teamId)
  const drones = getDronesByTeamId(teamId)

  return {
    totalMembers: users.length,
    rescuers: users.filter((u) => u.role === "rescuer").length,
    technicalMonitors: users.filter((u) => u.role === "technical_monitor").length,
    activeDrones: drones.filter((d) => d.status === "active").length,
    totalDrones: drones.length,
  }
}

function getBeachStats(beachId) {
  const teams = getTeamsByBeachId(beachId)
  const activeTeams = teams.filter((t) => t.status === "active").length

  let totalMembers = 0
  let totalDrones = 0

  teams.forEach((team) => {
    const stats = getTeamStats(team.team_id)
    totalMembers += stats.totalMembers
    totalDrones += stats.totalDrones
  })

  return {
    totalTeams: teams.length,
    activeTeams,
    totalMembers,
    totalDrones,
  }
}

// API Configuration for MongoDB backend

const API_CONFIG = {
  BASE_URL: 'http://localhost:3009/api',
  ENDPOINTS: {
    // API cho bãi biển
    BEACHES: {
      LIST: '/beaches',
      DETAIL: (id) => `/beaches/${id}`,
      CREATE: '/beaches',
      UPDATE: (id) => `/beaches/${id}`,
      DELETE: (id) => `/beaches/${id}`
    },
    // API cho team
    TEAMS: {
      LIST: '/teams',
      DETAIL: (id) => `/teams/${id}`,
      CREATE: '/teams',
      UPDATE: (id) => `/teams/${id}`,
      DELETE: (id) => `/teams/${id}`
    },
    // API cho drone
    DRONES: {
      LIST: '/drones',
      DETAIL: (id) => `/drones/${id}`,
      CREATE: '/drones',
      UPDATE: (id) => `/drones/${id}`,
      DELETE: (id) => `/drones/${id}`,
      UPDATE_STATUS: (id) => `/drones/${id}/status`,
      UPDATE_BATTERY: (id) => `/drones/${id}/battery`,
      UPDATE_LOCATION: (id) => `/drones/${id}/location`
    },
    // API cho survey
    SURVEYS: {
      LIST: '/surveys',
      DETAIL: (id) => `/surveys/${id}`,
      CREATE: '/surveys',
      UPDATE: (id) => `/surveys/${id}`,
      DELETE: (id) => `/surveys/${id}`,
      UPDATE_STATUS: (id) => `/surveys/${id}/status`
    },
    // API xác thực
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh'
    }
  }
};

// Schema cho MongoDB
const SCHEMAS = {
  BEACH: {
    beach_id: String,
    beach_name: String,
    manager_id: String,
    location: {
      lat: Number,
      lng: Number
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    },
    area: Number,
    description: String,
    created_at: Date,
    updated_at: Date
  },
  TEAM: {
    team_id: String,
    team_name: String,
    beach_id: String,
    manager_id: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    },
    created_at: Date,
    updated_at: Date
  },
  DRONE: {
    drone_id: String,
    drone_name: String,
    team_id: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'flying'],
      default: 'inactive'
    },
    battery_level: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    location: {
      lat: Number,
      lng: Number
    },
    last_maintenance: Date,
    created_at: Date,
    updated_at: Date
  },
  SURVEY: {
    survey_id: String,
    survey_name: String,
    beach_id: String,
    team_id: String,
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending'
    },
    scheduled_time: Date,
    completed_time: Date,
    assigned_to: String,
    description: String,
    created_at: Date,
    updated_at: Date
  }
};

// Helper functions cho API calls
const api = {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async post(endpoint, body) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async put(endpoint, body) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'API call failed');
      }
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Export
window.API_CONFIG = API_CONFIG;
window.SCHEMAS = SCHEMAS;
window.api = api; 
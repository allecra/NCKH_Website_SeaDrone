const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb+srv://allecraira:123@dataseadrone.it03l2o.mongodb.net/', {
    dbName: 'rescue_system',
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Định nghĩa schema
const BeachSchema = new mongoose.Schema({
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
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const TeamSchema = new mongoose.Schema({
    team_id: String,
    team_name: String,
    beach_id: String,
    manager_id: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
    user_id: String,
    team_id: String,
    fullname: String,
    role: {
        type: String,
        enum: ['admin', 'manager', 'member'],
        default: 'member'
    },
    phone: String,
    email: String,
    address: String,
    avatar: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const DroneSchema = new mongoose.Schema({
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
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const SurveySchema = new mongoose.Schema({
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
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const Survey_DroneSchema = new mongoose.Schema({
    survey_id: String,
    drone_id: String,
    assigned_at: {
        type: Date,
        default: Date.now
    }
});

// Thêm model cho Account_Team
const AccountTeamSchema = new mongoose.Schema({
    team_id: String,
    username: String,
    password: String
});

// Models
const Beach = mongoose.model('Beach', BeachSchema, 'Beach');
const Team = mongoose.model('Team', TeamSchema, 'Team');
const User = mongoose.model('User', UserSchema, 'User');
const Drone = mongoose.model('Drone', DroneSchema, 'Drone');
const Survey = mongoose.model('Survey', SurveySchema, 'Survey');
const Survey_Drone = mongoose.model('Survey_Drone', Survey_DroneSchema, 'Survey_Drone');
const Account_Team = mongoose.model('Account_Team', AccountTeamSchema, 'Account_Team');


// Middleware xử lý lỗi
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
};

// API cho bãi biển
app.get('/api/Beach', async (req, res) => {
    const beaches = await Beach.find();
    res.json(beaches);
});
app.post('/api/Beach', async (req, res) => {
    const beach = new Beach(req.body);
    await beach.save();
    res.json(beach);
});
app.put('/api/Beach/:id', async (req, res) => {
    const beach = await Beach.findOneAndUpdate({ beach_id: req.params.id }, req.body, { new: true });
    res.json(beach);
});
app.delete('/api/Beach/:id', async (req, res) => {
    await Beach.deleteOne({ beach_id: req.params.id });
    res.json({ success: true });
});

// API cho team
app.get('/api/Team', async (req, res) => {
    const { beach_id } = req.query;
    let teams;
    if (beach_id) {
        teams = await Team.find({ beach_id });
    } else {
        teams = await Team.find();
    }
    res.json(teams);
});
app.post('/api/Team', async (req, res) => {
    const team = new Team(req.body);
    await team.save();
    res.json(team);
});
app.put('/api/Team/:id', async (req, res) => {
    const team = await Team.findOneAndUpdate({ team_id: req.params.id }, req.body, { new: true });
    res.json(team);
});
app.delete('/api/Team/:id', async (req, res) => {
    await Team.deleteOne({ team_id: req.params.id });
    res.json({ success: true });
});

// API cho User
app.get('/api/User', async (req, res) => {
    const Users = await User.find();
    res.json(Users);
});
app.post('/api/User', async (req, res) => {
    const User = new User(req.body);
    await User.save();
    res.json(User);
});
app.put('/api/User/:id', async (req, res) => {
    const User = await User.findOneAndUpdate({ User_id: req.params.id }, req.body, { new: true });
    res.json(User);
});
app.delete('/api/User/:id', async (req, res) => {
    await User.deleteOne({ User_id: req.params.id });
    res.json({ success: true });
});

// Route test kết nối MongoDB và trích xuất dữ liệu
app.get('/api/test-mongo', async (req, res) => {
    try {
        const beaches = await Beach.find();
        res.json({
            success: true,
            count: beaches.length,
            data: beaches
        });
    } catch (err) {
        res.json({
            success: false,
            error: err.message
        });
    }
});

// Route đăng nhập
app.post('/api/auth/login', async (req, res) => {
    const { username, password, accountType } = req.body;

    // Ví dụ: kiểm tra tài khoản admin cứng
    if (accountType === 'admin' && username === 'admin' && password === 'admin123') {
        return res.json({
            username: 'admin',
            role: 'admin',
            user_id: 'admin_id',
            team_id: null
        });
    }

    // Ví dụ: kiểm tra tài khoản monitor cứng
    if ((accountType === 'monitor' || accountType === 'technical_monitor') && username === 'team_nt_alpha' && password === 'team123') {
        return res.json({
            username: 'team_nt_alpha',
            role: 'technical_monitor',
            user_id: 'monitor_id',
            team_id: 'team_nt_alpha'
        });
    }

    // Nếu không đúng, trả về lỗi
    return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu!' });
});

// API cho Survey_Drone
app.get('/api/Survey_Drone', async (req, res) => {
    const surveys = await Survey_Drone.find();
    res.json(surveys);
});
app.get('/api/Survey_Drone/:id', async (req, res) => {
    const survey = await Survey_Drone.findById(req.params.id);
    res.json(survey);
});
app.post('/api/Survey_Drone', async (req, res) => {
    const survey = new Survey_Drone(req.body);
    await survey.save();
    res.json({ success: true, survey });
});
app.put('/api/Survey_Drone/:id', async (req, res) => {
    const survey = await Survey_Drone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, survey });
});
app.delete('/api/Survey_Drone/:id', async (req, res) => {
    await Survey_Drone.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

const PORT = 3009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
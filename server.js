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
<<<<<<< HEAD
    fullname: String,
    role: {
        type: String,
        enum: ['admin', 'manager', 'member'],
        default: 'member'
    },
=======
    fullname: String, // <-- Đúng là fullname
    role: String,
>>>>>>> admin
    phone: String,
    email: String,
    address: String,
    avatar: String,
<<<<<<< HEAD
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
=======
    status: String
>>>>>>> admin
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
<<<<<<< HEAD
app.get('/api/beaches', async (req, res, next) => {
=======
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
    const { team_id } = req.query;
    let users;
    if (team_id) {
        users = await User.find({ team_id });
    } else {
        users = await User.find();
    }
    res.json(users);
});
app.post('/api/User', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json(user);
});
app.put('/api/User/:id', async (req, res) => {
    const user = await User.findOneAndUpdate({ user_id: req.params.id }, req.body, { new: true });
    res.json(user); // Trả về user đã sửa
});
app.delete('/api/User/:id', async (req, res) => {
    await User.deleteOne({ User_id: req.params.id });
    res.json({ success: true });
});

// Route test kết nối MongoDB và trích xuất dữ liệu
app.get('/api/test-mongo', async (req, res) => {
>>>>>>> admin
    try {
        const beaches = await Beach.find();
        res.json({
            success: true,
            data: beaches
        });
    } catch (err) {
        next(err);
    }
});

<<<<<<< HEAD
app.post('/api/beaches', async (req, res, next) => {
    try {
        const beach = new Beach(req.body);
        await beach.save();
        res.json({
            success: true,
            data: beach
        });
    } catch (err) {
        next(err);
    }
});

app.put('/api/beaches/:id', async (req, res, next) => {
    try {
        const beach = await Beach.findOneAndUpdate(
            { beach_id: req.params.id },
            { ...req.body, updated_at: Date.now() },
            { new: true }
        );
        if (!beach) {
            return res.status(404).json({
                success: false,
                message: 'Beach not found'
            });
        }
        res.json({
            success: true,
            data: beach
        });
    } catch (err) {
        next(err);
    }
});

app.delete('/api/beaches/:id', async (req, res, next) => {
    try {
        const beach = await Beach.findOneAndDelete({ beach_id: req.params.id });
        if (!beach) {
            return res.status(404).json({
                success: false,
                message: 'Beach not found'
            });
        }
        res.json({
            success: true,
            message: 'Beach deleted successfully'
        });
    } catch (err) {
        next(err);
    }
});

// API cho team
app.get('/api/teams', async (req, res, next) => {
    try {
        const { beach_id } = req.query;
        let teams;
        if (beach_id) {
            teams = await Team.find({ beach_id });
        } else {
            teams = await Team.find();
        }
        res.json({
            success: true,
            data: teams
        });
    } catch (err) {
        next(err);
    }
});

app.post('/api/teams', async (req, res, next) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.json({
            success: true,
            data: team
        });
    } catch (err) {
        next(err);
    }
});

app.put('/api/teams/:id', async (req, res, next) => {
    try {
        const team = await Team.findOneAndUpdate(
            { team_id: req.params.id },
            { ...req.body, updated_at: Date.now() },
            { new: true }
        );
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        res.json({
            success: true,
            data: team
        });
    } catch (err) {
        next(err);
    }
});

app.delete('/api/teams/:id', async (req, res, next) => {
    try {
        const team = await Team.findOneAndDelete({ team_id: req.params.id });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }
        res.json({
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (err) {
        next(err);
    }
});

// API cho drone
app.get('/api/drones', async (req, res, next) => {
    try {
        const { team_id } = req.query;
        let drones;
        if (team_id) {
            drones = await Drone.find({ team_id });
        } else {
            drones = await Drone.find();
        }
        res.json({
            success: true,
            data: drones
        });
    } catch (err) {
        next(err);
    }
});

app.post('/api/drones', async (req, res, next) => {
    try {
        const drone = new Drone(req.body);
        await drone.save();
        res.json({
            success: true,
            data: drone
        });
    } catch (err) {
        next(err);
    }
});

app.put('/api/drones/:id', async (req, res, next) => {
    try {
        const drone = await Drone.findOneAndUpdate(
            { drone_id: req.params.id },
            { ...req.body, updated_at: Date.now() },
            { new: true }
        );
        if (!drone) {
            return res.status(404).json({
                success: false,
                message: 'Drone not found'
            });
        }
        res.json({
            success: true,
            data: drone
        });
    } catch (err) {
        next(err);
    }
});

app.delete('/api/drones/:id', async (req, res, next) => {
    try {
        const drone = await Drone.findOneAndDelete({ drone_id: req.params.id });
        if (!drone) {
            return res.status(404).json({
                success: false,
                message: 'Drone not found'
            });
        }
        res.json({
            success: true,
            message: 'Drone deleted successfully'
        });
    } catch (err) {
        next(err);
    }
});

// API cho survey
app.get('/api/Survey', async (req, res, next) => {
    try {
        const { survey_id, survey_name, description, status, created_by } = req.query;
        let query = {};
        if (survey_id ) query.survey_id = survey_id;    
        if (survey_name) query.survey_name = survey_name;
        if (description) query.description = description;
        if (status) query.status = status;
        if (created_by) query.created_by = created_by;
        
        const surveys = await Survey.find(query);
        console.log('Found surveys:', surveys);
        res.json({
            success: true,
            data: surveys
        });
    } catch (err) {
        console.error('Error in /api/Survey:', err);
        next(err);
    }
});

app.post('/api/surveys', async (req, res, next) => {
    try {
        const survey = new Survey(req.body);
        await survey.save();
        res.json({
            success: true,
            data: survey
        });
    } catch (err) {
        next(err);
    }
});

app.put('/api/surveys/:id', async (req, res, next) => {
    try {
        const survey = await Survey.findOneAndUpdate(
            { survey_id: req.params.id },
            { ...req.body, updated_at: Date.now() },
            { new: true }
        );
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        res.json({
            success: true,
            data: survey
        });
    } catch (err) {
        next(err);
    }
});

app.delete('/api/surveys/:id', async (req, res, next) => {
    try {
        const survey = await Survey.findOneAndDelete({ survey_id: req.params.id });
        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }
        res.json({
            success: true,
            message: 'Survey deleted successfully'
        });
    } catch (err) {
        next(err);
    }
});

// API xác thực
app.post('/api/auth/login', async (req, res) => {
    const { username, password, accountType } = req.body;
    console.log('Login attempt:', { username, password, accountType });

    // Tìm trong collection Account_Team
    const account = await Account_Team.findOne({ username, password });
    if (account) {
        return res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            username,
            role: accountType,
            team_id: account.team_id
        });
    }

    res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập!' });
});

// API lấy tất cả Survey_Drone
app.get('/api/Survey_Drone', async (req, res) => {
    try {
        const surveyDrones = await Survey_Drone.find();
        res.json({ success: true, data: surveyDrones });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// Thêm mới
app.post('/api/Survey_Drone', async (req, res) => {
    try {
        const surveyDrone = new Survey_Drone(req.body);
        await surveyDrone.save();
        res.json({ success: true, data: surveyDrone });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// Sửa
app.put('/api/Survey_Drone/:id', async (req, res) => {
    try {
        const surveyDrone = await Survey_Drone.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!surveyDrone) return res.status(404).json({ success: false, message: 'Không tìm thấy báo cáo' });
        res.json({ success: true, data: surveyDrone });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// Xóa
app.delete('/api/Survey_Drone/:id', async (req, res) => {
    try {
        const surveyDrone = await Survey_Drone.findByIdAndDelete(req.params.id);
        if (!surveyDrone) return res.status(404).json({ success: false, message: 'Không tìm thấy báo cáo' });
        res.json({ success: true, message: 'Đã xóa báo cáo' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// API lấy danh sách user (có thể lọc theo team_id)
app.get('/api/User', async (req, res) => {
    try {
        const { team_id, user_id } = req.query;
        let query = {};
        if (team_id) query.team_id = team_id;
        if (user_id) query.user_id = user_id;
        const users = await User.find(query);
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// API thêm user
app.post('/api/User', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// API sửa user
app.put('/api/User/:id', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ user_id: req.params.id }, req.body, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// API xóa user
app.delete('/api/User/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ user_id: req.params.id });
        if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
        res.json({ success: true, message: 'Đã xóa user' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// API lấy danh sách team (có thể lọc theo team_id)
app.get('/api/Team', async (req, res) => {
    try {
        const { team_id } = req.query;
        let query = {};
        if (team_id) query.team_id = team_id;
        const teams = await Team.find(query);
        res.json({ success: true, data: teams });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: err.message });
    }
});

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = 3005;
=======
app.post('/api/auth/login', (req, res) => {
    const { username, password, accountType } = req.body;
    // Ví dụ tài khoản cứng
    if (
        (username === 'admin' && password === 'admin123') ||
        (username === 'team_nt_alpha' && password === 'team123')
    ) {
        // Lưu role vào localStorage ở FE nếu muốn
        return res.json({ success: true, message: 'Đăng nhập thành công!', username, role: accountType });
    }
    res.status(401).json({ success: false, message: 'Sai thông tin đăng nhập!' });
});

const PORT = 3009;
>>>>>>> admin
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


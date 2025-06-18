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
});

// Định nghĩa schema
const BeachSchema = new mongoose.Schema({
    beach_id: String,
    beach_name: String,
    manager_id: String,
    location: {
        lat: Number,
        lng: Number
    }
});

const TeamSchema = new mongoose.Schema({
    team_id: String,
    team_name: String,
    beach_id: String,
    manager_id: String,

});

const UserSchema = new mongoose.Schema({
    user_id: String,
    team_id: String,
    fullname: String, // <-- Đúng là fullname
    role: String,
    phone: String,
    email: String,
    address: String,
    avatar: String,
    status: String
});

const Beach = mongoose.model('Beach', BeachSchema, 'Beach');
const Team = mongoose.model('Team', TeamSchema, 'Team');
const User = mongoose.model('User', UserSchema, 'User');

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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


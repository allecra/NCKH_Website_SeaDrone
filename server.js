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

const PORT = 3009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


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
    name: String,
    role: String,
    phone: String,
    email: String,
    status: String
});

const Beach = mongoose.model('Beach', BeachSchema, 'Beach');
const Team = mongoose.model('Team', TeamSchema, 'Team');
const User = mongoose.model('User', UserSchema, 'User');

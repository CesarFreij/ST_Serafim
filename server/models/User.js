const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    points: {type: Number, default: 0},
    todosClicked: { type: Map, of: String, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    telegram_id: String,
    is_bot: Boolean,
    first_name: String,
    last_name: String,
    user_name: String,
    languaje_code: String
}, {
    timestamps: true, versionKey: false
})

const User = model('user', userSchema);
module.exports = User;
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: {
        type: String
    },
    userName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function (next) {
    try {
        const hashed_password = await bcrypt.hash(this.password, 10);
        this.password = hashed_password;
        next();
    } catch (error) {
        next(error);
    }
})

const User = mongoose.model('user', userSchema);
module.exports = User;
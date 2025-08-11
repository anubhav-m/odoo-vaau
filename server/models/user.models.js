import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minLength: [5, 'Minimum length of username must be 5'],
        maxLength: [30, 'Maximum length of username can be 30'],
        match: [/^[a-z0-9]+$/, 'Username can only be lowercase alphanumeric']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profilePic: {
        type: String,
        default: "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    isFacilityOwner: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User;
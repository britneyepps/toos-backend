import mongoose from 'mongoose';

const users = mongoose.Schema({
    name: String,
    phone: String,
    email: String
},
    {
        timestamps: true
    });

const Users = mongoose.model('Users', users);
export default Users;
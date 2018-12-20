const mongoose= require('mongoose');

const UserSchema= new mongoose.Schema({
    
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    cart:{
        type: Object,
        default:null
    },
    orders:{
        type: Object,
        default:null
    }
}, {usePushEach: true})
const User= mongoose.model('users', UserSchema);

module.exports={User};



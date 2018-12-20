const mongoose= require ('mongoose');
const Schema= mongoose.Schema;

const orderSchema= new mongoose.Schema({
    userEmail:{
        type:String,
        required:true
    },
    order:{
        type:Object,
        required:true,
    },
    name:{ 
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    }
})

const Order= mongoose.model('Order',orderSchema);

module.exports={Order};
const { string } = require('joi');
const mongoose =require('mongoose');
const Schema=mongoose.Schema;
const reviewschema=new Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
})
module.exports=mongoose.model('review',reviewschema);
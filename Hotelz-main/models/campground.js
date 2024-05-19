const mongoose =require('mongoose');
const review = require('./review');
const Schema=mongoose.Schema;
const campgroundschema=new Schema({
 title:String,
 image:String,
 price:Number,
 description:String,
 location:String,
 author:{
    type:Schema.Types.ObjectId,
    ref: 'user'
 },
 reviews:[
    {
        type:Schema.Types.ObjectId,
        ref: 'review'
    }
 ]
});
campgroundschema.post('findOneAndDelete',async function(doc){
    if(doc){
        await review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports=mongoose.model('campground',campgroundschema);

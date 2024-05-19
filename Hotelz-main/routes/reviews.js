const express=require('express');
const router=express.Router({mergeParams:true});
const catchasync=require('../utilities/catchasync');
const review=require('../models/review');
const campground = require('../models/campground');
const {validatereview,isloggedin,isreviewauthor}=require('../middleware');

router.delete('/:reviewid',isloggedin,isreviewauthor,catchasync(async function(req,res){
    const {id,reviewid}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await review.findByIdAndDelete(reviewid);
    req.flash('success','Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}))
router.post('/',isloggedin,validatereview,catchasync(async function(req,res){
    const camp=await campground.findById(req.params.id);
    const rev=new review(req.body.review);
    rev.author=req.user._id;
    camp.reviews.push(rev);
    await rev.save();
    await camp.save();
    req.flash('success','Created new Review');
    res.redirect(`/campgrounds/${camp._id}`);
}))

module.exports=router;
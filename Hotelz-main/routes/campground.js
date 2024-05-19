const express=require('express');
const router=express.Router();
const catchasync=require('../utilities/catchasync');
const campground = require('../models/campground');
const {isloggedin,isauthor,validatecampground}=require('../middleware');
 
router.get('/',async function(req,res){
    const campgrounds=await campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
router.get('/new',isloggedin,catchasync(async function(req,res){
    res.render('campgrounds/new');
}))
router.get('/:id',catchasync(async function(req,res){
    const camp=await campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error','Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
}))
router.get('/:id/edit',isloggedin,isauthor,catchasync(async function(req,res){
    const camp=await campground.findById(req.params.id);
    if(!camp){
        req.flash('error','Cannot find that Campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{camp});
}))
router.post('/',isloggedin,validatecampground,catchasync(async function(req,res){
   const camp=new campground(req.body.campground);
   camp.author=req.user._id;
   await camp.save();
   req.flash('success','Successfully made a new Campground');
   res.redirect(`/campgrounds/${camp._id}`);
}))
router.put('/:id',isloggedin,isauthor,validatecampground,catchasync(async function(req,res){
   const {id}=req.params;
   const camp=await campground.findByIdAndUpdate(id,{...req.body.campground});
   req.flash('success','Successfully updated Campground');
   res.redirect(`/campgrounds/${camp._id}`);
}))
router.delete('/:id',isloggedin,isauthor,async function(req,res){
    const {id}=req.params;
    await campground.findByIdAndDelete(id); 
    req.flash('success','Successfully deleted the Campground');
    res.redirect('/campgrounds');
})

module.exports=router;
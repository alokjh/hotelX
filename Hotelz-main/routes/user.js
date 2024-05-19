const express=require('express');
const router=express.Router();
const user=require('../models/user');
const catchasync=require('../utilities/catchasync');
const passport=require('passport');

router.get('/register',function(req,res){
    res.render('user/register');
})
router.post('/register',catchasync(async function(req,res){
  try{
    const {email,username,password}=req.body;
    const User=new user({email,username});
    const registereduser=await user.register(User,password);
    req.login(registereduser,function(err){
        if(err) return next(err);
        req.flash('success','Welcomne to Hotelz');
        res.redirect('/campgrounds');
    })
  }
  catch(e){
    req.flash('error',e.message);
    res.redirect('/register');
  }
}));

router.get('/login',function(req,res){
    res.render('user/login');
});
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),function(req,res){
    req.flash('success','Welcomne Back!');
    res.redirect('/campgrounds');
})

router.get('/logout',function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','Goodbye!');
        res.redirect('/campgrounds');
      });
})


module.exports=router;
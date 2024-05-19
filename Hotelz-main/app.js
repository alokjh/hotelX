const express=require('express');
const app=express();
const path=require('path');
const methodoverride=require('method-override');
const ejsmate=require('ejs-mate');
const ExpressError=require('./utilities/ExpressError');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localstrategy=require('passport-local');
const user=require('./models/user');

const userroutes=require('./routes/user');
const campgroundroutes=require('./routes/campground');
const reviewroutes=require('./routes/reviews')


const mongoose=require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/Hotelz',{
});
const db=mongoose.connection;
db.modelNames('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('database conected');
});
app.engine('ejs',ejsmate);
app.use(express.urlencoded({extended:true}));
app.use(methodoverride('_method'));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
const sessionconfig={
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60**60*25*7,
        maxAge:1000*60**60*25*7
    }
}
app.use(session(sessionconfig));
app.use(flash());

app.use(passport.session());
app.use(passport.initialize());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');  
    next();
})

app.use('/',userroutes);
app.use('/campgrounds',campgroundroutes);
app.use('/campgrounds/:id/reviews',reviewroutes);


app.all('*',function(req,res,next){
     next(new ExpressError('Page not found!',404));
})
app.use(function(e,req,res,next){
   const {statuscode=500}=e;
   if(!e.message) e.message='Oh No, Something Went Wrong';
   res.status(statuscode).render('error',{e});
})

app.listen(3000,function(){
    console.log('connetion port 3000');
})


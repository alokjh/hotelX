const ExpressError=require('./utilities/ExpressError');
const {Campgroundschema,Reviewschema}=require('./schemas.js');
const campground = require('./models/campground');
const review=require('./models/review');


module.exports.isloggedin=function(req,res,next){
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validatecampground=function(req,res,next){
    const {error}=Campgroundschema.validate(req.body);
    if(error){
        const msg=error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
module.exports.isauthor=async function(req,res,next){
    const {id}=req.params;
    const camp=await campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validatereview=function(req,res,next){
    const {error}=Reviewschema.validate(req.body);
    if(error){
        const msg=error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}
module.exports.isreviewauthor=async function(req,res,next){
    const {id,reviewid}=req.params;
    const rev=await review.findById(reviewid);
    if(!rev.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
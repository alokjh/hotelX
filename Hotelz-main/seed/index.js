const campground=require('../models/campground');
const cities=require('./cities');
const {places,description}=require('./seedhelpers');
const mongoose=require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/Hotelz',{
});
const db=mongoose.connection;
db.modelNames('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('database conected');
});

const sample=function(array){
    return array[Math.floor(Math.random()*(array.length))];
}
const seeddb=async function(){
    await campground.deleteMany({});
    for(let i=0;i<50;i++){
        const rand=Math.floor(Math.random()*1000);
        const camp=new campground({
            author:"63a54caaf5de88932534544f",
            location:`${cities[rand].city}, ${cities[rand].state}`,
            title:`${sample(description)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/483251',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur vero suscipit eveniet tenetur? Voluptatibus ad alias placeat totam et recusandae ullam aspernatur? Provident laboriosam numquam ex soluta vitae, vel voluptates!',
            price:rand
        })
        await camp.save(); 
    } 
}
seeddb().then(function(){
    mongoose.connection.close();
});
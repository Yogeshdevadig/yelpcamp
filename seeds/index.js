const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

 
const sample = array =>array[Math.floor(Math.random()*array.length)]

const seedDB = async ()=>{
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*30)+10;
        const camp = new Campground({
            author:'60f672077f00304654db391d',
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            images:[
                {
                    url: 'https://res.cloudinary.com/dyiodemma/image/upload/v1627734866/YelpCamp/bazrql2jmgt2lirf2nst.jpg',
            filename: 'YelpCamp/bazrql2jmgt2lirf2nst',
            
                }
            ],
            description:'lorem ajdn nad his son went into jungle for food and they came back empty handed',
        
            price
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})
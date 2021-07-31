if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
 
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const {campgroundSchema,reviewSchema} = require('./schemas.js')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const Review = require('./models/review')
const User = require('./models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local')


const session = require('express-session')
const flash = require('connect-flash')

const userRoutes = require('./routes/users')
const campgroundsRoutes = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false

})
const db = mongoose.connection
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected")
})

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
const sessionConfig={
    secret:'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    
    next();
})



app.use('/',userRoutes)
app.use('/campgrounds',campgroundsRoutes)
app.use('/campgrounds/:id/reviews',reviewsRoutes)


   



app.get('/',(req,res)=>{
    res.render('home')
    })


 




  
 app.all('*',(req,res,next)=>{
   next(new ExpressError('page not found',404) )

 })
app.use((err,req,res,next)=>{
    const{statusCode=500} = err
    if(!err.message)
    {
        err.message = 'Oh something went wrong!'
    }
    res.status(statusCode).render('error',{err});
}

)
app.listen(3000,()=>{
    console.log('listennig to the port 3000')
})


const Express = require('express')
const router = Express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const {reviewSchema } = require('../schemas.js')
const Campground = require('../models/campground')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn,isAuthor,validateCampground,validateReview,isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')
 

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))
 module.exports = router
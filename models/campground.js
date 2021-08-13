const { required } = require('joi');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const Schema = mongoose.Schema;

const { cloudinary } = require('../cloudinary');

// https://res.cloudinary.com/dqbp1yv9w/image/upload/w_300/v1628190897/YelpCamp/a0lutaby8cit0lyygqaz.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_300/ar_4:3,c_crop');
});

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema  = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String, // don’t do location: { type: String }
      enum: ['Point'], // location.type must be 'Point', 
      required: true
    }, 
    coordinates: {
      type: [Number], 
      required: true
    }
  },
  price: Number, 
  description: String, 
  location: String, 
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId, 
      ref: 'Review'
    }
  ]
}, opts)

CampgroundSchema.virtual('properties.popupMarkup').get(function() {
  return `
    <h4><a href="/campgrounds/${this._id}">${this.title}</a></h4>
    <p>${this.description.substring(0,66)}…</p>
  `;
});

CampgroundSchema.post('findOneAndDelete', async function(doc){
  if(doc.reviews) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
  if (doc.images) {
    const seeds = [
      'YelpCamp/camping1_hrvpro',
      'YelpCamp/camping2_dhplav',
      'YelpCamp/camping3_x0y27a',
    ]
    for (const img of doc.images) {
      if (!(seeds.includes(img.filename))) {
        console.log(img.filename);
        await cloudinary.uploader.destroy(img.filename)
      }
    }
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
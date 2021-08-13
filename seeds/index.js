const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true, 
  useUnifiedTopology: true
})

const db = mongoose.connection; 
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
  console.log("database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Review.deleteMany({});
  for (let i=0; i < 200; i++) {
    const random1000 = Math.floor(Math.random()*1000);
    const price = Math.floor(Math.random()*20) + 10;
    const camp = new Campground({
      // YOUR USER ID
      author: '610131301445500b5e716889',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point', 
        coordinates: [ 
          cities[random1000].longitude, 
          cities[random1000].latitude 
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dqbp1yv9w/image/upload/v1628504543/YelpCamp/camping1_hrvpro.jpg',
          filename: 'YelpCamp/camping1_hrvpro'
        },
        {
          url: 'https://res.cloudinary.com/dqbp1yv9w/image/upload/v1628504544/YelpCamp/camping2_dhplav.jpg',
          filename: 'YelpCamp/camping2_dhplav'
        },
        {
          url: 'https://res.cloudinary.com/dqbp1yv9w/image/upload/v1628504543/YelpCamp/camping3_x0y27a.jpg',
          filename: 'YelpCamp/camping3_x0y27a'
        }
      ],
      description: 'Nordwestlich von Urberach liegt der Höhenzug „Bulau“. Die in diesem Gebiet gelegenen Sanddünen, die hier die Ausläufer des Odenwaldes überlagern, wurden schon früh zur Errichtung von Grabhügeln genutzt. Bronzearmringe datieren ihre Entstehung in die mittlere Hallstattzeit (700 – 450 v.Chr.). Ursprünglich bestand hier eine Gruppe aus ca. 25 Hügelgräbern, von denen zwei in ihren Konturen wieder hergestellt wurden.',
      price: price, 
    })
    await camp.save();
  }
}

seedDB();
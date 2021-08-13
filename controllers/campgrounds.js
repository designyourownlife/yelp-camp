const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({}) 
  // console.log(campgrounds.images);
  res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
  
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  // console.log(campground);
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path: 'reviews', 
    populate: {
      path: 'author'
    }
  }).populate('author');
  // console.log(campground); 
  if (!campground) {
    req.flash('error', 'Cannot find requested campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find requested campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params; 
  const seeds = [
    'YelpCamp/camping1_hrvpro',
    'YelpCamp/camping2_dhplav',
    'YelpCamp/camping3_x0y27a',
  ]
  // console.log(req.body.campground);
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  campground.geometry = geoData.body.features[0].geometry;
  // console.log(campground.author);
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      if (!(seeds.includes(filename))) {
        console.log(filename);
        await cloudinary.uploader.destroy(filename);
      }
    }
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }); 
    // console.log(campground)
  }
  req.flash('success', 'Successfully updated campground!')
  res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params; 
  await Campground.findByIdAndDelete(id); 
  req.flash('success', 'Campground has been succesfully deleted!');
  res.redirect('/campgrounds');
}
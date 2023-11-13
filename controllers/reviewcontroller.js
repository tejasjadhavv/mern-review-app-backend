const Review = require("../models/reviewModel");
const Brewery = require("../models/Brewery");
const mongoose = require("mongoose");

// get all reviews
const getbrewery = async (req, res) => {
  const brewery = await Brewery.find({}).sort({ createdAt: -1 });
  res.status(200).json(brewery);
};

//create a new review
const createreview = async (req, res) => {
  const { user_id, brewery_id, rating, description } = req.body;
  console.log(user_id);
  try {
    const reviewno = await Review.countDocuments({ brewery_id });
    const newReview = new Review({ user_id, brewery_id, rating, description });
    const savedReview = await newReview.save();

    const brewery = await Brewery.findOne({ id: brewery_id });
    if (!brewery) {
      return res.status(404).json({ message: "Brewery not found" });
    }

    console.log(reviewno);
    const totalRating = brewery.rating * reviewno + rating;
    brewery.rating = totalRating / (reviewno + 1);

    // Save the updated brewery
    const BreweryReview = await brewery.save();

    res.json(BreweryReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//Get a review
const getreview = async (req, res) => {
  const { id } = req.params.brewery_id;
  try {
    const reviews = await Review.find({ brewery_id: id });
    console.log(reviews);
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " Error Not Found" });
  }
};

module.exports = {
  getbrewery,
  getreview,
  createreview,
};

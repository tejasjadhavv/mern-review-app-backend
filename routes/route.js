const express = require("express");
const Review = require("../models/reviewModel");
const router = express.Router();
const Brewery = require("../models/Brewery");
const {
  getbrewery,
  getreview,
  createreview,
  // deletereview,
  // updatereview,
} = require("../controllers/reviewcontroller");
const requireAuth = require("../middleware/requireAuth");
router.use(requireAuth);

// GET all brewery
router.get("/", async (req, res) => {
  const brewery = await Brewery.find({}).sort({ createdAt: -1 });
  res.status(200).json(brewery);
});

// API endpoint for brewery search by otpion
router.get("/search", async (req, res) => {
  const { city, name, brewery_type } = req.query;

  try {
    let query = {};

    if (city) {
      query.city = { $regex: new RegExp(city, "i") }; // Case-insensitive regex
    }

    if (name) {
      query.name = { $regex: new RegExp(name, "i") };
    }

    if (brewery_type) {
      query.brewery_type = { $regex: new RegExp(brewery_type, "i") };
    }
    // console.log(query);
    const breweries = await Brewery.find(query);
    res.json(breweries);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/reviews/:brewery_id", async (req, res) => {
  const { brewery_id } = req.params;
  let id = brewery_id.split(":")[1];
  console.log(id);
  try {
    // Retrieve reviews for a specific brewery_id
    const reviews = await Review.find({ brewery_id: id });

    if (!reviews) {
      return res
        .status(404)
        .json({ message: "No reviews found for the provided brewery_id" });
    }

    // Return the reviews
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// API endpoint for brewery search  by id
router.get("/:id", async (req, res) => {
  const breweryId = req.params.id;

  try {
    const brewery = await Brewery.findOne({ id: breweryId });

    if (!brewery) {
      return res.status(404).json({ message: "Brewery not found" });
    }

    res.json(brewery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // GET  review all related to Brewery_id

//POST a new review
router.post("/reviews", createreview);

// // UPDATE a review
// router.patch("/:id", (req, res) => {
//   res.json({ mssg: "UPDATE a review" });
// });

module.exports = router;

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const RRoutes = require("./routes/route");
const axios = require("axios");
const Brewery = require("./models/Brewery");
const Review = require("./models/reviewModel");
const User = require("./models/user");
const userRoutes = require("./routes/userroute");
const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/breweries", RRoutes);
app.use("/api/user", userRoutes);

const API_URL = "https://api.openbrewerydb.org/breweries";

// Function to check if there is data in the database
const hasDataInDatabase = async () => {
  const count = await Brewery.countDocuments();
  return count > 0;
};

// Function to fetch data from the API and save it to the database
const fetchAndSaveBreweries = async () => {
  try {
    const dataExists = await hasDataInDatabase();

    if (!dataExists) {
      const response = await axios.get(API_URL);
      const breweriesData = response.data;
      for (const breweryData of breweriesData) {
        // Extract relevant data from the API response
        const {
          id,
          name,
          brewery_type,
          address_1,
          city,
          state,
          rating,
          website_url,
          phone,
        } = breweryData;

        // Create a new Brewery instance with the extracted data
        const newBrewery = new Brewery({
          id,
          name,
          brewery_type,
          address_1,
          city,
          state,
          rating,
          website_url,
          phone,
        });

        // Save the new brewery to the database
        await newBrewery.save();
      }

      console.log("Data successfully fetched and saved to the database.");
    } else {
      console.log(
        "Data already exists in the database. Skipping data fetching."
      );
    }
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }
};

// Call the function to fetch and save breweries
fetchAndSaveBreweries();

//connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log("listening for requests on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });

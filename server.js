const express = require('express');
const server = express();
const body_parser = require('body-parser');
const mongoose = require('mongoose');

// Parse JSON (application/json content-type)
server.use(body_parser.json());

// Database setup
const db = require("./db");
const dbName = "sca_game";

// Public
const collectionName = "scoreboard";

// Local (for development)
// const collectionName = "scoreboard_dev";

// Database init
db.initialize(dbName, collectionName, function(dbCollection) {
  // Set headers
  server.all("/*", (request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
    next();
  });

  // Get the entire score list
  server.get("/api/score", async (req, res) => {
    try {
      const scoreboard = await dbCollection.find().toArray();
      res.json(scoreboard);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get score result based on id
  server.get("/api/score/:_id", async (req, res) => {
    const userid = new mongoose.Types.ObjectId(req.params._id);

    try {
      const score = await dbCollection.findOne({ "_id": userid });
      res.json(score);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Add new item to score list
  server.post("/api/score", async (req, res) => {
    const newScore = req.body;

    try {
      const score = await dbCollection.insertOne(newScore);
      res.json(score);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Delete a selected item from score list based on id
  server.delete("/api/score/:_id", async function(req, res) {
    const userid = new mongoose.Types.ObjectId(req.params._id);

    try {
      const deleteScore = await dbCollection.deleteOne({ "_id": userid });
      res.json(deleteScore);
    } catch(err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update a selected item from score list based on id
  server.put("/api/score/:_id", async function(req, res) {
    const userid = new mongoose.Types.ObjectId(req.params._id);
    const newItem = req.body;

    try {
      const updateScore = await dbCollection.updateOne({ "_id": userid }, { $set: newItem });
      res.json(updateScore);
    } catch(err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update a selected item with new data
  //
  // server.put("/api/score/:phone", function (request, response) {
  //   const phone = request.params.phone;
  //   const item = request.body;
  //   console.log("Editing item: ", phone, " to be ", item);

  //   dbCollection.updateOne({"phone": phone}, {$set: item}, function (error) {
  //       if (error) throw error;
  //       // send back entire updated list, to make sure frontend data is up-to-date
  //       dbCollection.find().toArray(function(_error, _result) {
  //           if (_error) throw _error;
  //           response.json(_result);
  //       });
  //   });
  // }); 

  // });
}, function(err) {
  throw (err);
});

// << db init >>
// server.listen(port, () => {
//   console.log(`Server listening at ${port}`);
// });

// Initialize the app.
var app = server.listen(process.env.PORT || 8080, function () {
  var port = app.address().port;
  console.log("App now running on port", port);
});

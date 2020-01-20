const express = require('express');
const server = express();

const body_parser = require('body-parser');

// parse JSON (application/json content-type)
server.use(body_parser.json());

const port = 4000;

// << db setup >>
const db = require("./db");
const dbName = "sca_game";
const collectionName = "scoreboard";

// << db init >>
db.initialize(dbName, collectionName, function(dbCollection) {
  // Get the entire score list
  //
  server.get("/api/score", (request, response) => {
    dbCollection.find().toArray((error, result) => {
        if (error) throw error;
        response.json(result);
    });
  });

  // Add new item to score list
  //
  server.post("/api/score", (request, response) => {
    const item = request.body;

    dbCollection.insertOne(item, (error, result) => {
        if (error) throw error;

        dbCollection.find().toArray((error, result) => {
            if (error) throw error;
            response.json(result);
        });
    });
  });

  // Delete a selected item from score list
  //
  server.delete("/api/score/:id", (request, response) => {
    const itemId = request.params._id;
    console.log("Delete item with id: ", itemId);

    dbCollection.deleteOne({ id: itemId }, function(error, result) {
        if (error) throw error;

        dbCollection.find().toArray(function(_error, _result) {
            if (_error) throw _error;
            response.json(_result);
        });
    });

  // Update a selected item with new data
  //
  server.put("/api/score/:id", (request, response) => {
    const itemId = request.params._id;
    const item = request.body;
    console.log("Editing item: ", itemId, " to be ", item);

    dbCollection.updateOne({ id: itemId }, { $set: item }, (error, result) => {
        if (error) throw error;

        dbCollection.find().toArray(function(_error, _result) {
            if (_error) throw _error;
            response.json(_result);
        });
    });
  });
});

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

var User = require('../models/users.js');


var userController = {


      locate: function (req, res) {
          var data = req.body;
          var date = new Date();
          var username = req.user.username;


          User.findOne({username:username}, function(err, user) {
            if (err) return handleErr(err);

            // coordinates: [data.longitude, data.latitude]
            find = {
              coordinates: [data.latitude, data.longitude],
              datetime: date
            };

            user.location = find;
            user.save();

          });

  },


  scan: function (req, res) {

    var date = new Date();
    var minusmin = date.setMinutes(date.getMinutes() - 60);

    var geoJSONpoint = {
      "type": "Point",
      "coordinates": [
           parseFloat(req.user.location.coordinates[0]),
           parseFloat(req.user.location.coordinates[1])
       ]
    }

    // Lookup documents based on time first because geolocation query is a longer operation and we don't care about doing
    // additional operation (db lookup) if no documents come back from the (specified) time query
    User.find({ "location.datetime": {"$gte": minusmin}}, function (err, user) {

      if (err) return handleErr(err);


      var otherUsers = user.map(function(u) { return u.username}).filter(function(u) { return u != req.user.username });


      if ( otherUsers.length > 0 ) {



          
          // User.find({ username: user[i].username, $nearSphere: { $geometry: { type: "Point", coordinates: [ req.user.location.coordinates[0], req.user.location.coordinates[1] ]}, "$maxDistance": 300} }, function(err, data) {
          User.find({ "username": { "$in": otherUsers }, "location.coordinates": {"$nearSphere": { "$geometry": geoJSONpoint, "$maxDistance": 4000 } }} , function(err, data){
              if (err) return handleErr(err);

              // console.log(data);

              
              res.send(data)

          });


        }

          
      });      

  }
}





module.exports = userController;

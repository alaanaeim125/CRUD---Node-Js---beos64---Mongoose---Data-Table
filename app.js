const express = require('express');
const ejs = require('ejs');
var bodyParse = require('body-parser');
const app = express();
const mongodb = require('mongodb');
const fs = require('fs');
const cors = require('cors');
var mongoose = require('mongoose');

/************ middleware  */
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({
  extended: true
}));
app.use(express.static('veiws'));
/*********************** */

app.set('view engine', 'ejs');


/******   mongooose ***************/

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017/testejs';
mongoose.connect(mongoDB, {
  useNewUrlParser: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//view all data
app.get('/', (req, res) => {
  db.collection("users").find({}).toArray(function (err, data) {
    res.render('index', {
      usersdata: data
    })
  });
});



//get one user
app.get('/getUser/:id', (req, res) => {

  var iid = req.params.id;
  db.collection('users').findOne({
    _id: mongodb.ObjectId(iid)
  }, function (err, data) {
    res.render('single', {
      userdata: data
    })
  });
});


//delete one user
app.get('/delete/:id', (req, res) => {
  var iid = req.params.id;
  db.collection('users').deleteOne({
    _id: mongodb.ObjectId(iid)
  }, function (err, data) {
    if (err) {
      res.render('delete', {
        userdata: "Product Is Not Found To Delete"
      })
    } else {
      res.render('delete', {
        userdata: "SucessFully Deleted..."
      })
    }
  })
  res.redirect('/');
})



//Add New User
app.get('/addNewUser', function (req, res) {
  res.render('addUser');
})

app.post('/insertUser', function (req, res) {
  var obj = req.body;
  db.collection('users').insertOne(obj, function (err, res) {
    if (err) {
      console.log('error In Insert Data .... ');
    } else {
      console.log('Sucessfully Data Inserted .....');
    }
  })
  res.redirect('/');
})


//show edit page when click edit and render data to page wz it
app.get('/edit/:id', function (req, res) {
  var iid = req.params.id;
  db.collection('users').findOne({
    _id: mongodb.ObjectId(iid)
  }, function (err, data) {
    if (err) {
      console.log('Error In Update User ..... ');
    } else {
      res.render('edituser', {
        userdata: data
      });
    }
  });


})

//update user
app.post('/updateUser', function (req, res) {
  var id = mongodb.ObjectId(req.body.objId);
  db.collection("users").updateOne({
    _id: id
  }, {
    $set: req.body
  }, function (err, data) {
    if (err) {
      console.log("error Occured In Update Data ..... ");
    } else {
      console.log("Success Update Data ..... ");
    }
  })
  res.redirect('/');
})




// httpServer.listen(3000);
app.listen(8080, () => console.log('Server Started on port 8080'));
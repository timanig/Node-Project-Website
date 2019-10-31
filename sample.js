var express = require('express');
var app = express();
var fs = require('fs');
var str = require('./artists.json');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var jsonParser = bodyParser.json();
//var str = JSON.parse(fs.readFileSync('/Applications/XAMPP/xamppfiles/htdocs/home/artists.json', 'utf8'));

var path = require('path');

var port = process.env.PORT || 3000;

const mysql = require('mysql');

const options = {
    user: 'root',
    password: '',
    database: 'nodeProject'
  }
  const connection = mysql.createConnection(options)

app.use('/assets', express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.get('/', function (req, res){
    res.render('index');
});

app.get('/api', function (req, res){
  res.render('api');
});

app.get('/aboutme', function (req, res){
    res.render('aboutme');
});

app.get('/api/aboutme', function (req, res){
  res.render('api/aboutme');
});

app.get('/musictoo', function (req, res){
    res.render('musictoo');
});

app.get('/contactus', function (req, res){
    res.render('contactus');
});

app.get('/currensy', function (req, res){
    res.render('currensy', {str:str});
});

app.get('/childishgambino', function (req, res){
    res.render('childishgambino', {str:str});
});

app.get('/wizkhalifa', function (req, res){
    res.render('wizkhalifa', {str:str});
});

app.get('/guestbook', function (req, res){
  res.render('guestbook', {str:str});
});

  app.post('/contactus', urlencodedParser, function (req, res) {
    res.send('Thanks for your concerns');
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.concerns);
 

  connection.connect(err => {
    if (err) {
      console.error('An error occurred while connecting to the DB');
      throw err
    }
  })

  connection.query("INSERT INTO nodeProject.contactDB (name, email, concerns) VALUES ('"+req.body.name+"','"+req.body.email+"','"+req.body.concerns+"');", 
  function(error, results, fields) {
    if (error|| req.body.name === "" || !req.body.email === "" ||!req.body.concerns === "") {
      res.status(422)
      res.send('ERROR 422');
      console.error('An error occurred while executing the query');
      throw error
    } else{
      console.log('You have successfully updated your table!');
    }
  });

});
app.listen(port);
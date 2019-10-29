var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.use('/assets', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function (req, res){
    res.render('index');
});

app.get('/aboutme', function (req, res){
    res.render('aboutme');
});

app.get('/musictoo', function (req, res){
    res.render('musictoo');
});

app.get('/currensy', function (req, res){
    res.render('currensy');
});

app.get('/childishgambino', function (req, res){
    res.render('childishgambino');
});

app.get('/wizkhalifa', function (req, res){
    res.render('wizkhalifa');
});




app.listen(port);
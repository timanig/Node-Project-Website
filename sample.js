var express = require('express');
var multer  = require('multer');
var app = express();
var fs = require('fs');
var str = require('./artists.json');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

var jsonParser = bodyParser.json();

var path = require('path');

var port = process.env.PORT || 3000;

var storage =   multer.diskStorage({
    destination: './public/uploads',
    filename: function(req,file,cb){
      cb(null,file.fieldname + '-' +Date.now() +
      path.extname(file.originalname));
    }
});

const upload = multer({ 
  storage : storage,
  limits:{fileSize:1000000000}
}).single('myImage');

const mysql = require('mysql');

const paypal = require('paypal-rest-sdk');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'ARn0Pb30h6VjpYzOYJhkGD7EqSl9soeg9A7yPdXOUUTGVqJQbW6ZcH6QgWppQX6eW0VIjcENz8_nZ9L1',
  'client_secret': 'ECaVv60DmFl9lDAPxe3RXPkE_7M5CmPC5DOn3Es79gDqL50k8snEmDem2KxfMO_4EZozFYPKWZzCPjxl'
});


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

app.get('/',function(req,res){
  res.sendFile(__dirname + "/contactus");
});

app.get('/cancel', () => res.send('Cancelled'));

app.get('/success', (req,res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  var execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency":"USD",
            "total":"100.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function(error,payment){
    if(error){
      console.log(error.response);
      throw error;
    } else{
      console.log(JSON.stringify(payment));
      res.send('Thanks for your purchase. Enjoy!');
    }
  });
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

app.post('/upload',function(req,res){
  upload(req,res,function(err) {
      if(err) {
          return res.end("Error uploading file.");
      }
      res.end("File is uploaded");
  });
});

app.post('/pay', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Instrumental",
                "sku": "001",
                "price": "100.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "100.00"
        },
        "description": "This is hardest beat you will ever hear in life."
    }]
};
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        for(let i = 0;i< payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            res.redirect(payment.links[i].href);
          }
        }
    }
  });
});

app.listen(port);
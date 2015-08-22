// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://localhost:27017/todoDB');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location under /public, eg: the js file for front end
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Schema = mongoose.Schema;
var TodoSchema = new Schema({ text : String});
var myTodo = mongoose.model('myTodo', TodoSchema);

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', function(req, res) {

  // use mongoose to get all todos in the database
  myTodo.find(function(err, todos) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err)

      res.json(todos); // return all todos in JSON format
    });
});

// get one todo
app.get('/api/todos/:todo_id', function(req, res) {

  myTodo.findById(req.params.todo_id,function(err, todo) {
    if(err)
      res.send(err);
    else
      res.json(todo);
  });

});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

  // create a todo, information comes from AJAX request from Angular
  myTodo.create({
    text : req.body.text,
    done : false
  }, function(err) {
    if (err)
      res.send(err);

      // get and return all the todos after you create another
      myTodo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
  myTodo.remove({
    _id : req.params.todo_id
  }, function(err) {
    if (err)
      res.send(err);

      // get and return all the todos after you create another
      myTodo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });
});

// update a todo
app.put('/api/todos/:todo_id', function(req, res) {
  // get and return all the todos after you create another
  myTodo.findById(req.params.todo_id,function(err, todo) {
    todo.update({
      text:req.body.text},function(err){
      if (err)
        res.send(err);

      // get and return all the todos after you create another
      myTodo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });
  });
    
});

// application -------------------------------------------------------------
app.get('', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");


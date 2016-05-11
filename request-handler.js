var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var storage = {'/classes/messages': []};
var totalMsgs = [];
var count = 0;

// initialize server and body parser middleware
var server = express();
server.use(allowCrossDomain);
server.use(express.static(path.resolve(__dirname, '../client')));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.route('/classes/messages')
  .get(function(req, res) {
    console.log({results : storage}, '*****');
    res.status(200).send({results : totalMsgs});
  })
  .post(function(req, res) {
    var obj = req.body;
    obj.objectId = count;
    count++; 
    console.log('post: ', obj);
    totalMsgs.push(obj);
    !storage[req.body.roomname.toLowerCase()] ? storage[req.body.roomname.toLowerCase()] = [obj] : storage[req.body.roomname.toLowerCase()].push(obj);
    res.status(201).send();
  });
// main route
server.route('/classes/messages/:roomName')
  .get(function(req, res) {
    var room = req.params.roomName;
    console.log({results:storage[room]}, '******');
    storage[room.toLowerCase()] ? res.status(200).send({results: storage[room.toLowerCase()]}) : res.status(404).send(); 
  })
  .post(function(req, res) {
    var room = req.params.roomName;
    var obj = req.body;
    obj.objectId = count;
    console.log('post: ', obj);
    count++; 
    totalMsgs.push(obj);
    !storage[room.toLowerCase()] ? storage[room.toLowerCase()] = [obj] : storage[room.toLowerCase()].push(obj);
    res.status(201).send();
  });



// all routes that do not match the format above
server.route('/')
  .get(function(req, res) {
    console.log('?');
    res.status(200).sendFile(path.resolve('../client/index.html'));
  })

server.route('*')
  .get(function(req, res) {
    res.status(404).send('cannot get from this page');//.sendFile(path.resolve('../client/index.html'));
    //res.status(404).send('invalid route to get from');
  })
  .post(function(req, res) {
    res.status(404).send('invalid route to add to');
  });

server.listen(3000, function() {
  console.log('listening man');
});
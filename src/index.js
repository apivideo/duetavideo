require('dotenv').config();
const express = require('express');
const app = express();
var server = require('http').createServer(app);
app.use(express.static('public'));

var io = require('socket.io')(server);
var spawn = require('child_process').spawn;
var port =3035;


app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index1.html');
});

spawn('ffmpeg',['-h']).on('error',function(m){

	console.error("FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!");
	process.exit(-1);
});




server.listen(process.env.PORT || port, () =>
  console.log('Example app listening on port '+port+'!'),
);
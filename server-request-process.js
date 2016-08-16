//var - kintamojo deklaravimas

//toliau yra bibliotekos, kurios parsisiuncia is interneto ir naudojamos
var dispatcher = require('httpdispatcher');
var fs = require("fs");
var http = require('http');
var gpio = require('rpi-gpio');
var time = require;

//const - konstantu deklaravimas
//konstantu reiksme nesikeicia vykdant koda ir galetu pakeitus vienoj vietoj sutvarkyt visa koda
const PORT = 80; 
const FORWARD = 11;
const BACK = 7;
const RIGHT = 12;
const LEFT = 13;
;

//naudojantis biblioteka nustatom gpio jungtis isvedimo rezimu
gpio.setup(FORWARD, gpio.DIR_OUT);
gpio.setup(BACK, gpio.DIR_OUT);
gpio.setup(RIGHT, gpio.DIR_OUT);
gpio.setup(LEFT, gpio.DIR_OUT);


//Lets use our dispatcher
function handleRequest(request, response){
    try {
        //log the request on console
        console.log(request.url);
        //Disptach
        dispatcher.dispatch(request, response);
    } catch(err) {
        console.log(err);
    }
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //console log isveda i terminala (juoda langa)
    console.log("Server listening on: http://localhost:%s", PORT);
});


//A sample GET request    
dispatcher.onGet("/", function(req, res) {
    showPage(res);
});    
    
dispatcher.onGet("/forward-go", function(req, res) {

    sendSignal(FORWARD, true);
}); 

dispatcher.onGet("/back-go", function(req, res) {

    sendSignal(BACK, true);
}); 

dispatcher.onGet("/right-go", function(req, res) {

    sendSignal(RIGHT, true);
}); 

dispatcher.onGet("/left-go", function(req, res) {

    sendSignal(LEFT, true);
}); 

dispatcher.onGet("/forward-stop", function(req, res) {

    sendSignal(FORWARD, false);
}); 

dispatcher.onGet("/back-stop", function(req, res) {

    sendSignal(BACK, false);
}); 

dispatcher.onGet("/right-stop", function(req, res) {

    sendSignal(RIGHT, false);
}); 

dispatcher.onGet("/left-stop", function(req, res) {

    sendSignal(LEFT, false);
}); 

function sendSignal(port, onOff) {
    gpio.write(port, onOff, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}


function showPage(res) {
   fs.readFile("index.html", function (err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
   });
}

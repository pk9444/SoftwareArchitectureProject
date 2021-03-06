// var TicketManager = require('./TicketManager.js');
// TicketManager.main();
// import './deviceQueue.js';

// import './Queue.js'

const fs = require('fs');
const path = require('path');
const bsdiff = require('bsdiff-nodejs');

var Queue = require('./Queue.js');
let deviceQueue = new Queue()

var express = require('express');
var app = express();

app.get('/', function(req, res){
   res.send("Hello world!");
});

let tempvar = 7

let updateFile = {'w':1, 'h': 2, 'a':3, 't':4}


// Routes Needed
// All the routes expect a device id to be submitted
// POST Register & Unregister (way to detect device has disconnected)
    // What devices exist on the network. Device submits its id.
    // Device Manager will set the device id
// POST/GET A way to apply for a ticket
    // Devices continously poll for a ticket until it recieves it (submit id, waiting for ticket response)
// GET Requesting bspatch diff
    // retrieve patch diff (we are only keeping track of the current and newer versions on the server side).
    // return bspath diff
// POST bspatch result/status (did it work or not)
    // Submit device id and status code

app.post('/applyForTicket', function(req,res){
    // Check if device is in queue or is currently updating
    // If true, do not give it a ticket
    // Otherwise give it a ticket

    // console.log(req.body);
    console.log(req.headers.id);

    if(deviceQueue.addDeviceToQueue(req.headers.id)) {
        res.json({'code':deviceQueue.APPROVED_CODE});
    }else {
        res.json({'code':deviceQueue.DENIED_CODE});
    }

    // if(getDeviceStatus(device) === 201 || isInQueue(device)){
    //     return DENIED_CODE;
    // } else {
    //     addDeviceToQueue(device);
    //     return APPROVED_CODE;
    // }
    // addDeviceToQueue(req.headers.id)
    // 
});


app.post('/registerDevice', function(req,res){

    // console.log(req);
    console.log(req.headers.id);


    if(!deviceQueue.deviceInMasterList(req.headers.id)) {
        // add device to master list
        deviceQueue.addDeviceToMasterList(req.headers.id);
        res.json({'code':701});
    } else {
        res.json({"code":702});
    }
});


let hardUpdateFile = {'x':1, 'y': 2, 'c':3, 'k':4}
let hardBadUpdateFile = {'k':1, 'f': 2, 'x':3, 'u':4}
app.get('/getUpdateFile', function(req,res){
    // res.send("Here is the damn update" + tempvar)

    console.log(deviceQueue.deviceMasterList);
    console.log(deviceQueue.deviceUpdateQueue);
    if (req.headers.id) {
        if (deviceQueue.deviceInUpdateQueue(req.headers.id)) {
            res.json(hardUpdateFile);
        }else {
            res.json({'code':702});
        }
    }

    

});

app.put('/deviceUpdated', function(req,res){
    deviceQueue.removeDeviceFromQueue(req.headers.id);
});

app.get('/updateAvailable', function(req,res){
    
});

app.post('/needUpdate', function(req,res) {
    const oldFile = path.join(__dirname, 'resources/react-native-zip-archive-5.0.1.zip');
    const newFile = path.join(__dirname, 'resources/react-native-zip-archive-5.0.6.zip');
    const patchFile = path.join(__dirname, 'resources/react.patch');

    bsdiff.diff(oldFile, newFile, patchFile, function (result) {
        console.log('diff:' + String(result).padStart(4) + '%');
    });

    // const file = patchFile;
    res.download(patchFile); // Set disposition and send it.
})


app.listen(4000);
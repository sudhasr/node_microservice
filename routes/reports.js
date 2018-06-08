var express = require('express');
var router = express.Router();
var Enum = require('enum');
var fs = require('fs');
var csv = require('fast-csv');

var promiseCSV = require('../node_modules/promiseCSV');

const uuidv4 = require('uuid/v4');
uuidv4(); // ⇨ Sample UUID:-'416ac246-e7ac-49ff-93b4-f7e94d997e6b'

const DB = require('../app');

var MongoClient = require('mongodb').MongoClient;

var payloads = [];


var myDB;

MongoClient.connect('mongodb://FlyHigh:webarchitects280@ds231205.mlab.com:31205/flyhigh', function (err, database) {

    if (err) throw err;

    myDB = database.db('flyhigh');
    myDB.collection('validRequests');
});


var status = new Enum(['processing','done']);

router.post('/generate',function (req,res) {        //Microservice to POST the payload
    if (!req.body.payload){                         // Validation for missing payload
        res.status(400).send("Payload Missing")     // Send the response with 400 status code
    } else {
        var payload = req.body.payload;

        if (payload.length === 0) {                 // Validation for empty array as payload
            res.status(412).send("Array size is zero");
        } else if (payload.length > 100) {          // Validation for Payload to exceed maximum size allowed
            res.status(413).send("Payload has > 100 Strings");
        } else {                                    // Valid Request handling
            var uuid = uuidv4();
            myDB.collection('validRequests').insert({'uuid':uuid,'status':status.get(1).key}, function (err,res2) {     //Database Query to insert the payload with the uuid field and status field as processing
                var dataToWrite = payload.join();                                                                       // Writing payload data to a CSV file
                dataToWrite = dataToWrite+'\n';
                console.log(dataToWrite);

                payloads.push(payload);

                var ws = fs.createWriteStream('reportsData.csv');

                console.log(ws);
                csv.
                write(
                    payloads
                    ,{headers:true})
                    .pipe(ws);

                    myDB.collection('validRequests').update({'uuid':uuid},{$set:{'status':status.get(2).key,'filename':'reportsData.csv','filepath':'/'}});      // Changing status field as done after writing payload to csv file

            });
            res.setHeader('x-process-id',uuid);
            res.status(202).send("Request is valid");


        }
    }
});

router.get('/',function (req,res) {                     //Validation for a missing uuid in the get request for a payload
    res.status(400).send("uuid is missing");
});

router.get('/:reqUuid',function (req,res) {         //Microservice to GET the payload against a given uuid as param
    console.log("Inside the get router");
    if (!req.params.reqUuid || req.params.reqUuid === undefined ) {
        res.status(400).send("uuid is missing");

    }
    else {
        var requested_uuid = req.params.reqUuid;
        console.log('requested_uuid', requested_uuid);

        myDB.collection('validRequests').findOne({uuid: requested_uuid}, function (err, record) {       // Database query to find a payload with uuid as the search criteria
            if (err) {
                res.send("No Record with matching uuid");
                console.log('mongo collection error');
            }
            else if (record === null) {                         //Validation for a missing record for a uuid
                res.send("No Record with matching uuid");
            }
            else if ( record.status && record.status === 'processing' && record) {          //Validation for a record whose payload is still in process of getting written to csv file
                console.log(record.status);
                res.status(204).send();
            }
            else if (record.status && record.status === 'done' && record) {              //Sending the CSV file after validating that the payload against a given uuid has been written in csv file

                res.download(record.filename, 'reportsData.csv', function (err) {
                    if (err) res.send('Error while downloading file');
                });
            }
        });
    }
});

module.exports = router;

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require("../../config");
var http = require('http');
var https = require('https');

//CRI change:
var bodyParser = require('body-parser');

// Configure application routes
module.exports = function (app) {

    // CRI change to allow JSON parsing from requests:    
    app.use(bodyParser.json()); // Support for json encoded bodies 
    app.use(bodyParser.urlencoded({ extended: true })); // Support for encoded bodies

    function log(apiMethod, apiUri, msg) {
        console.log("[" + apiMethod + "], [" + apiUri + "], [" + msg + "], [UTC:" +
            new Date().toISOString().replace(/\..+/, '') + "]");
    }

    /**
     * Adding MongoDB APIs:
     * 
     */

    /* GET Physicians. */
    app.get('/physicians', function (req, res) {

        var DB_COLLECTION_NAME = "physicians";
        var db = req.db;

        log("GET", "/physicians", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({}, {}, function (e, docs) {

            log("GET", "/physicians", "Found:" + JSON.stringify({ "Physicians": docs }));
            res.send({ "Physicians": docs });

        });
    });

    /* POST Physicians */
    app.post('/physicians', function (req, res) {

        var DB_COLLECTION_NAME = "physicians";
        // Set our internal DB variable
        var db = req.db;
        var physicians = req.body.Physicians;

        if (physicians == null || physicians == undefined) {
            log("POST", "/physicians", "physicians payload detected but no physicians on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        log("POST", "/physicians", "Array of physicians to be inserted is [" + JSON.stringify(physicians) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(physicians, function (err, doc) {
            if (err) {
                log("POST", "/physicians", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/physicians", "Records were added successfully...");
                res.send({
                    Physicians: doc
                });
            }
        });
    });

    /* GET Physician by Id */
    app.get('/physician/:PhysicianId', function (req, res) {

        var DB_COLLECTION_NAME = "physicians";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("GET", "/physician/:PhysicianId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        log("GET", "/physician/:PhysicianId", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "_id": id }, {}, function (e, docs) {

            log("GET", "/physician/:PhysicianId", "Found: [" + JSON.stringify(docs) + "]");
            res.send(docs);

        });
    });

    /* PUT a Physician by Id */
    app.put('/physician/:PhysicianId', function (req, res) {

        var DB_COLLECTION_NAME = "physicians";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("PUT", "/physician/:PhysicianId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        // Set our internal DB variable
        var db = req.db;
        var physician = req.body;

        if (physician == null || physician == undefined) {
            log("PUT", "/physician/:PhysicianId", "Physician payload detected but no physician on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        log("PUT", "/physician/:PhysicianId", "Physician to be inserted is [" + JSON.stringify(physician) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Update row to MongoDB
        collection.update({ "_id": id }, physician, function (err, doc) {
            if (err) {
                log("PUT", "/physician/:PhysicianId", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/physician/:PhysicianId", "Records were updated successfully...");
                res.send({
                    Message: 'Records were updated successfully...'
                });
            }
        });
    });


    /* Delete Physician by Id */
    app.delete('/physician/:PhysicianId', function (req, res) {

        var DB_COLLECTION_NAME = "physicians";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("DELETE", "/physician/:PhysicianId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        log("DELETE", "/physician/:PhysicianId", "Collection to be removed by Id [" + id + "]");

        //Remove all documents:
        collection.remove({ "_id": id });

        // Return succes answer
        log("DELETE", "/physician/:PhysicianId", "Record with Id [" + id + "] was deleted successfully...");
        res.send({
            Message: 'Record with Id [' + id + '] was deleted successfully...'
        });
    });

    /* GET Physician Prescriptions by Id */
    app.get('/physician/:PhysicianId/prescriptions', function (req, res) {

        var DB_COLLECTION_NAME = "prescriptions";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("GET", "/physician/:PhysicianId/prescriptions", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        log("GET", "/physician/:PhysicianId/prescriptions", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PhysicianId": id }, {}, function (e, docs) {

            log("GET", "/physician/:PhysicianId/prescriptions", "Found: [" + JSON.stringify(docs) + "]");
            res.send(docs);

        });
    });

    /* GET Physician Calendar by Id */
    app.get('/physician/:PhysicianId/calendar', function (req, res) {

        var DB_COLLECTION_NAME = "calendar";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("GET", "/physician/:PhysicianId/calendar", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        log("GET", "/physician/:PhysicianId/calendar", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PhysicianId": id }, {}, function (e, docs) {

            log("GET", "/physician/:PhysicianId/calendar", "Found: [" + JSON.stringify(docs) + "]");
            res.send({ Calendar: docs });

        });
    });

    /* POST to Add Physician Calendar Entries */
    app.post('/physician/:PhysicianId/calendar', function (req, res) {

        var DB_COLLECTION_NAME = "calendar";
        // Set our internal DB variable
        var db = req.db;

        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("POST", "/physician/:PhysicianId/calendar", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var calendar = req.body.Calendar;

        if (calendar == null || calendar == undefined) {
            log("POST", "/physician/:PhysicianId/calendar", "Physician payload detected but no physician calendar on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PhysicianId in each Calendar entry with default Physician Id given as part of the URI.
         * This way, whether they were given or not, we default to the Physician Id given as part of the URI.
         */

        var calendarEntries = calendar.length;
        for (var i = 0; i < calendarEntries; i++) {
            calendar[i].PhysicianId = id;
        }


        log("POST", "/physician/:PhysicianId/calendar", "Physician calendar entry to be inserted is [" + JSON.stringify(calendar) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(calendar, function (err, doc) {
            if (err) {
                log("POST", "/physician/:PhysicianId/calendar", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/physician/:PhysicianId/calendar", "Records were added successfully...");
                res.send({
                    Calendar: doc
                });
            }
        });
    });

    /* PUT to Add Physician Calendar Entries */
    app.put('/physician/:PhysicianId/calendar/:entryId', function (req, res) {

        var DB_COLLECTION_NAME = "calendar";
        // Set our internal DB variable
        var db = req.db;

        var physicianId = req.params.PhysicianId;
        var entryId = req.params.entryId;
        var calendar = req.body.Entry;

        if (physicianId == null || physicianId == undefined) {
            log("PUT", "/physician/:PhysicianId/calendar", "PhysicianId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (entryId == null || entryId == undefined) {
            log("PUT", "/physician/:PhysicianId/calendar", "Calendar entryId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (calendar == null || calendar == undefined) {
            log("PUT", "/physician/:PhysicianId/calendar", "Physician payload detected but no physician calendar on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PhysicianId in Calendar entry with default Physician Id given as part of the URI.
         * This way, whether they were given or not, we default to the Physician Id given as part of the URI.
         */

        calendar.PhysicianId = physicianId;


        log("PUT", "/physician/:PhysicianId/calendar", "Physician calendar entry to be inserted is [" + JSON.stringify(calendar) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.update({ "_id": entryId }, calendar, function (err, doc) {
            if (err) {
                log("PUT", "/physician/:PhysicianId/calendar", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/physician/:PhysicianId/calendar", "Records were added successfully...");
                res.send({
                    Message: 'Records were added successfully...'
                });
            }
        });
    });




    /** Note: This following APIs are hidden to documentation.
     *  It is only to be used by Administrators with responsibility.
     **/

    /* Get All Collections by Name */
    app.get('/collection/:cname', function (req, res) {

        var collectionName = req.params.cname;

        if (collectionName == null || collectionName == undefined) {
            log("GET", "/collection/:cname", "collection name empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var DB_COLLECTION_NAME = collectionName;
        var db = req.db;

        log("GET", "/collection/:cname", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({}, {}, function (e, docs) {

            log("GET", "/collection/:cname", "Found:" + JSON.stringify({ docs }));
            res.send({ docs });

        });
    });
    /* Delete All Collections by Name*/
    app.delete('/collection/:cname', function (req, res) {

        var collectionName = req.params.cname;

        if (collectionName == null || collectionName == undefined) {
            log("DELETE", "/collection/:cname", "collection name empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var DB_COLLECTION_NAME = collectionName;
        
        var db = req.db;
        var collection = db.get(DB_COLLECTION_NAME);

        log("DELETE", "/collection/:cname", "Collection: [" + DB_COLLECTION_NAME + "]");

        //Remove all documents:
        collection.remove();

        // Return succes answer
        log("DELETE", "/collection/:cname", "All [" + DB_COLLECTION_NAME + "] Records were  deleted successfully...");
        res.send({
            Message: 'Records were  deleted successfully...'
        });
    });


};

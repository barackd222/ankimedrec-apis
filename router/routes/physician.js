var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var config = require("../../config");

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

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "physicians";
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

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "physicians";
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
        log("POST", "/physicians", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
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
    app.get('/physicians/:PhysicianId', function (req, res) {

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");
        
        var DB_COLLECTION_NAME = "" + appKey + "physicians";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("GET", "/physicians/:PhysicianId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        log("GET", "/physicians/:PhysicianId", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "_id": id }, {}, function (e, docs) {

            log("GET", "/physicians/:PhysicianId", "Found: [" + JSON.stringify(docs) + "]");
            res.send(docs);

        });
    });

    /* PUT a Physician by Id */
    app.put('/physicians/:PhysicianId', function (req, res) {

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "physicians";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("PUT", "/physicians/:PhysicianId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        // Set our internal DB variable
        var db = req.db;
        var physician = req.body;

        if (physician == null || physician == undefined) {
            log("PUT", "/physicians/:PhysicianId", "Physician payload detected but no physician on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        log("PUT", "/physicians/:PhysicianId", "Physician to be inserted is [" + JSON.stringify(physician) + "]");

        // Set collection
        log("PUT", "/physicians/:PhysicianId", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");        
        var collection = db.get(DB_COLLECTION_NAME);

        // Update row to MongoDB
        collection.update({ "_id": id }, physician, function (err, doc) {
            if (err) {
                log("PUT", "/physicians/:PhysicianId", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/physicians/:PhysicianId", "Records were updated successfully...");
                res.send({
                    Message: 'Records were updated successfully...'
                });
            }
        });
    });


    /* Delete Physician by Id */
    app.delete('/physicians/:PhysicianId', function (req, res) {

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "physicians";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("DELETE", "/physicians/:PhysicianId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        log("DELETE", "/physicians/:PhysicianId", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        log("DELETE", "/physicians/:PhysicianId", "Collection to be removed by Id [" + id + "]");

        //Remove all documents:
        collection.remove({ "_id": id });

        // Return succes answer
        log("DELETE", "/physicians/:PhysicianId", "Record with Id [" + id + "] was deleted successfully...");
        res.send({
            Message: 'Record with Id [' + id + '] was deleted successfully...'
        });
    });

    /* GET Physician Prescriptions by Id */
    app.get('/physicians/:PhysicianId/prescriptions', function (req, res) {

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "prescriptions";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("GET", "/physicians/:PhysicianId/prescriptions", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        log("GET", "/physicians/:PhysicianId/prescriptions", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PhysicianId": id }, {}, function (e, docs) {

            log("GET", "/physicians/:PhysicianId/prescriptions", "Found: [" + JSON.stringify(docs) + "]");
            res.send(docs);

        });
    });

    /* GET Physician Calendar by Id */
    app.get('/physicians/:PhysicianId/calendar', function (req, res) {

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "calendar";
        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("GET", "/physicians/:PhysicianId/calendar", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        log("GET", "/physicians/:PhysicianId/calendar", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PhysicianId": id }, {}, function (e, docs) {

            log("GET", "/physicians/:PhysicianId/calendar", "Found: [" + JSON.stringify(docs) + "]");
            res.send({ Calendar: docs });

        });
    });

    /* POST to Add Physician Calendar Entries */
    app.post('/physicians/:PhysicianId/calendar', function (req, res) {

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "calendar";
        // Set our internal DB variable
        var db = req.db;

        var id = req.params.PhysicianId;

        if (id == null || id == undefined) {
            log("POST", "/physicians/:PhysicianId/calendar", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var calendar = req.body.Calendar;

        if (calendar == null || calendar == undefined) {
            log("POST", "/physicians/:PhysicianId/calendar", "Physician payload detected but no physician calendar on it... Nothing to do...");
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


        log("POST", "/physicians/:PhysicianId/calendar", "Physician calendar entry to be inserted is [" + JSON.stringify(calendar) + "]");

        // Set collection
        log("POST", "/physicians/:PhysicianId/calendar", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(calendar, function (err, doc) {
            if (err) {
                log("POST", "/physicians/:PhysicianId/calendar", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/physicians/:PhysicianId/calendar", "Records were added successfully...");
                res.send({
                    Calendar: doc
                });
            }
        });
    });

    /* PUT to Add Physician Calendar Entries */
    app.put('/physicians/:PhysicianId/calendar/:entryId', function (req, res) {

        var appKey = req.get("X-App-Key");
        var appKey = appKey != null && appKey != undefined ? appKey : "";
        console.log("X-App-Key used is [" + appKey + "]");

        var DB_COLLECTION_NAME = "" + appKey + "calendar";
        // Set our internal DB variable
        var db = req.db;

        var physicianId = req.params.PhysicianId;
        var entryId = req.params.entryId;
        var calendar = req.body.Entry;

        if (physicianId == null || physicianId == undefined) {
            log("PUT", "/physicians/:PhysicianId/calendar", "PhysicianId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (entryId == null || entryId == undefined) {
            log("PUT", "/physicians/:PhysicianId/calendar", "Calendar entryId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (calendar == null || calendar == undefined) {
            log("PUT", "/physicians/:PhysicianId/calendar", "Physician payload detected but no physician calendar on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PhysicianId in Calendar entry with default Physician Id given as part of the URI.
         * This way, whether they were given or not, we default to the Physician Id given as part of the URI.
         */

        calendar.PhysicianId = physicianId;


        log("PUT", "/physicians/:PhysicianId/calendar", "Physician calendar entry to be inserted is [" + JSON.stringify(calendar) + "]");

        // Set collection
        log("PUT", "/physicians/:PhysicianId/calendar", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.update({ "_id": entryId }, calendar, function (err, doc) {
            if (err) {
                log("PUT", "/physicians/:PhysicianId/calendar", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/physicians/:PhysicianId/calendar", "Records were added successfully...");
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
        log("DELETE", "/collection/:cname", "DB_COLLECTION_NAME [" + DB_COLLECTION_NAME + "]");
        var collection = db.get(DB_COLLECTION_NAME);

        

        //Remove all documents:
        collection.remove();

        // Return succes answer
        log("DELETE", "/collection/:cname", "All [" + DB_COLLECTION_NAME + "] Records were  deleted successfully...");
        res.send({
            Message: 'Records were  deleted successfully...'
        });
    });


};

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


    function callAPI(path, body, method) {

        // Command the AR Drone 2 to take off, stay and land!
        var host = "localhost";
        var port = config.port;

        // Send action to API:
        sendRequest(host, port, path, method, body, true);
    }

    function sendRequest(host, port, path, method, post_data, secured) {

        var post_req = null;

        var options = {
            host: host,
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Content-Length': post_data.length
            }
        };

        post_req = http.request(options, function (res) {

            console.log("Sending [" + host + ":" + port + path + "] under method [" + method + "]");
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ', chunk);
            });
        });




        post_req.on('error', function (e) {
            console.log('There was a problem with request: ' + e.message);
        });

        post_req.write(post_data);
        post_req.end();

    }

    function log(apiMethod, apiUri, msg) {
        console.log("[" + apiMethod + "], [" + apiUri + "], [" + msg + "], [UTC:" +
            new Date().toISOString().replace(/\..+/, '') + "]");
    }

    /**
     * Adding MongoDB APIs:
     * 
     */

    /* GET Patients. */
    app.get('/patients', function (req, res) {

        var DB_COLLECTION_NAME = "patients";
        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({}, {}, function (e, docs) {

            log("GET", "/patients", "Found:" + JSON.stringify({ "Patients": docs }));
            res.send({ "Patients": docs });

        });
    });

    /* POST Patients */
    app.post('/patients', function (req, res) {

        var DB_COLLECTION_NAME = "patients";
        // Set our internal DB variable
        var db = req.db;
        var patients = req.body.Patients;

        if (patients == null || patients == undefined) {
            log("POST", "/patients", "patients payload detected but no patients on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        log("POST", "/patients", "Array of patients to be inserted is [" + JSON.stringify(patients) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(patients, function (err, doc) {
            if (err) {
                log("POST", "/patients", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/patients", "Records were added successfully...");
                res.send({
                    Patients: doc
                });
            }
        });
    });

    /* GET Patient by Query Parameter */
    app.get('/patient', function (req, res) {

        var DB_COLLECTION_NAME = "patients";
        var m = req.query.m; //Method to Search for Patient
        var val = req.query.val; //Method value to search for Patient

        if (m == null || m == undefined) {
            log("GET", "/patient", "Search Method empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (val == null || val == undefined) {
            log("GET", "/patient", "Search Method Value empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        var q = {};

        switch (m.toUpperCase()) {

            case "MOBILE":

                q = { "Mobile": val };
                break;

            case "EMAIL":

                q = { "Email": val };
                break;


            default:
                log("GET", "/patient", "Search Method empty or invalid... Nothing to do...");
                res.status(400).end();//Bad request...
                return;
        }


        collection.find(q, {}, function (e, docs) {

            log("GET", "/patient", "Found: [" + JSON.stringify({ "Patients": docs }) + "]");
            res.send({ "Patients": docs });

        });
    });

    /* GET Patient by Id */
    app.get('/patient/:PatientId', function (req, res) {

        var DB_COLLECTION_NAME = "patients";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("GET", "/patient/:PatientId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "_id": id }, {}, function (e, docs) {

            log("GET", "/patient/:PatientId", "Found: [" + JSON.stringify(docs) + "]");
            res.send(docs);

        });
    });

    /* PUT a Patient by Id */
    app.put('/patient/:PatientId', function (req, res) {

        var DB_COLLECTION_NAME = "patients";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("PUT", "/patient/:PatientId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        // Set our internal DB variable
        var db = req.db;
        var patient = req.body;

        if (patient == null || patient == undefined) {
            log("PUT", "/patient/:PatientId", "Patient payload detected but no patient on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        log("PUT", "/patient/:PatientId", "Patient to be inserted is [" + JSON.stringify(patient) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Update row to MongoDB
        collection.update({ "_id": id }, patient, function (err, doc) {
            if (err) {
                log("PUT", "/patient/:PatientId", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/patient/:PatientId", "Records were updated successfully...");
                res.send({
                    Message: 'Records were updated successfully...'
                });
            }
        });
    });


    /* Delete Patient by Id */
    app.delete('/patient/:PatientId', function (req, res) {

        var DB_COLLECTION_NAME = "patients";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("DELETE", "/patient/:PatientId", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        log("DELETE", "/patient/:PatientId", "Collection to be removed by Id [" + id + "]");

        //Remove all documents:
        collection.remove({ "_id": id });

        // Return succes answer
        log("DELETE", "/patient/:PatientId", "Record with Id [" + id + "] was deleted successfully...");
        res.send({
            Message: 'Record with Id [' + id + '] was deleted successfully...'
        });
    });

    /**
     * 
     * Medical Consultations
     */

    /* GET Patient Medical Consultations by Id */
    app.get('/patient/:PatientId/consultations', function (req, res) {

        var DB_COLLECTION_NAME = "consultations";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("GET", "/patient/:PatientId/consultations", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PatientId": id }, {}, function (e, docs) {

            log("GET", "/patient/:PatientId/consultations", "Found: [" + JSON.stringify({ MedicalConsultations: docs }) + "]");
            res.send({ MedicalConsultations: docs });

        });
    });

    /* POST to Add Patient Consultation */
    app.post('/patient/:PatientId/consultations', function (req, res) {

        var DB_COLLECTION_NAME = "consultations";
        // Set our internal DB variable
        var db = req.db;

        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("POST", "/patient/:PatientId/consultations", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var consultations = req.body.MedicalConsultations;

        if (consultations == null || consultations == undefined) {
            log("POST", "/patient/:PatientId/consultations", "Patient payload detected but no patient medical consultations on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each consultations entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        var consultationsEntries = consultations.length;

        for (var x = 0; x < consultationsEntries; x++) {

            consultations[x].PatientId = id;
        }


        log("POST", "/patient/:PatientId/consultations", "Patient consultations entry to be inserted is [" + JSON.stringify(consultations) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(consultations, function (err, doc) {
            if (err) {
                log("POST", "/patient/:PatientId/consultations", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/patient/:PatientId/consultations", "Records were added successfully...");
                res.send({
                    MedicalConsultations: doc
                });
            }
        });
    });

    /* PUT to update Patient Consultation */
    app.put('/patient/:PatientId/consultations/:entryId', function (req, res) {

        var DB_COLLECTION_NAME = "consultations";
        // Set our internal DB variable
        var db = req.db;

        var patientId = req.params.PatientId;
        var entryId = req.params.entryId;
        var consultation = req.body.MedicalConsultation;

        if (patientId == null || patientId == undefined) {
            log("PUT", "/patient/:PatientId/consultations", "PatientId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (entryId == null || entryId == undefined) {
            log("PUT", "/patient/:PatientId/consultations", "Patient Medical Consultation entryId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (consultation == null || consultation == undefined) {
            log("PUT", "/patient/:PatientId/consultations", "Patient payload detected but no patient consultations on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        consultation.PatientId = patientId;


        log("PUT", "/patient/:PatientId/consultations", "Patient consultations entry to be inserted is [" + JSON.stringify(consultation) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.update({ "_id": entryId }, consultation, function (err, doc) {
            if (err) {
                log("PUT", "/patient/:PatientId/consultations", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/patient/:PatientId/consultations", "Records were added successfully...");
                res.send({
                    Message: 'Records were added successfully...'
                });
            }
        });
    });


    /**
     * 
     * Medical Appointments
     */


    /* GET Patient Medical Appointments by Id */
    app.get('/patient/:PatientId/appointments', function (req, res) {

        var DB_COLLECTION_NAME = "appointments";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("GET", "/patient/:PatientId/appointments", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PatientId": id }, {}, function (e, docs) {

            log("GET", "/patient/:PatientId/appointments", "Found: [" + JSON.stringify({ Appointments: docs }) + "]");
            res.send({ Appointments: docs });

        });
    });

    /* POST to Add Patient Appointments */
    app.post('/patient/:PatientId/appointments', function (req, res) {

        var DB_COLLECTION_NAME = "appointments";
        // Set our internal DB variable
        var db = req.db;

        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("POST", "/patient/:PatientId/appointments", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var appointments = req.body.Appointments;

        if (appointments == null || appointments == undefined) {
            log("POST", "/patient/:PatientId/appointments", "Patient payload detected but no patient medical appointments on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each appointment entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        var consultationsEntries = appointments.length;
        for (var i = 0; i < consultationsEntries; i++) {
            appointments[i].PatientId = id;
        }


        log("POST", "/patient/:PatientId/appointments", "Patient appointment entry to be inserted is [" + JSON.stringify(appointments) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(appointments, function (err, doc) {
            if (err) {
                log("POST", "/patient/:PatientId/appointments", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/patient/:PatientId/appointments", "Records were added successfully...");
                res.send({
                    Appointments: doc
                });
            }
        });
    });

    /* PUT to update Patient Appointment */
    app.put('/patient/:PatientId/appointments/:entryId', function (req, res) {

        var DB_COLLECTION_NAME = "appointments";
        // Set our internal DB variable
        var db = req.db;

        var patientId = req.params.PatientId;
        var entryId = req.params.entryId;
        var appointment = req.body.Appointment;

        if (patientId == null || patientId == undefined) {
            log("PUT", "/patient/:PatientId/appointments", "PatientId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (entryId == null || entryId == undefined) {
            log("PUT", "/patient/:PatientId/appointments", "Patient Medical Consultation entryId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (appointment == null || appointment == undefined) {
            log("PUT", "/patient/:PatientId/appointments", "Patient payload detected but no patient appointments on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        appointment.PatientId = patientId;


        log("PUT", "/patient/:PatientId/appointments", "Patient appointments entry to be inserted is [" + JSON.stringify(appointment) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.update({ "_id": entryId }, appointment, function (err, doc) {
            if (err) {
                log("PUT", "/patient/:PatientId/appointments", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/patient/:PatientId/appointments", "Records were added successfully...");
                res.send({
                    Message: 'Records were added successfully...'
                });
            }
        });
    });

    /**
     * 
     * Medical Prescriptions
     */


    /* GET Patient Medical Prescriptions by Id */
    app.get('/patient/:PatientId/prescriptions', function (req, res) {

        var DB_COLLECTION_NAME = "prescriptions";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("GET", "/patient/:PatientId/prescriptions", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PatientId": id }, {}, function (e, docs) {

            log("GET", "/patient/:PatientId/prescriptions", "Found: [" + JSON.stringify({ MedicalPrescriptionsConsultations: docs }) + "]");
            res.send({ Prescriptions: docs });

        });
    });

    /* POST to Add Patient Prescriptions */
    app.post('/patient/:PatientId/prescriptions', function (req, res) {

        var DB_COLLECTION_NAME = "prescriptions";
        // Set our internal DB variable
        var db = req.db;

        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("POST", "/patient/:PatientId/prescriptions", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var prescriptions = req.body.Prescriptions;

        if (prescriptions == null || prescriptions == undefined) {
            log("POST", "/patient/:PatientId/prescriptions", "Patient payload detected but no patient medical prescriptions on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each appointment entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        var consultationsEntries = prescriptions.length;
        for (var i = 0; i < consultationsEntries; i++) {
            prescriptions[i].PatientId = id;
        }


        log("POST", "/patient/:PatientId/prescriptions", "Patient appointment entry to be inserted is [" + JSON.stringify(prescriptions) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(prescriptions, function (err, doc) {
            if (err) {
                log("POST", "/patient/:PatientId/prescriptions", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/patient/:PatientId/prescriptions", "Records were added successfully...");
                res.send({
                    Prescriptions: doc
                });
            }
        });
    });

    /* PUT to update Patient Prescription */
    app.put('/patient/:PatientId/prescriptions/:entryId', function (req, res) {

        var DB_COLLECTION_NAME = "prescriptions";
        // Set our internal DB variable
        var db = req.db;

        var patientId = req.params.PatientId;
        var entryId = req.params.entryId;
        var prescription = req.body.Prescription;

        if (patientId == null || patientId == undefined) {
            log("PUT", "/patient/:PatientId/prescriptions", "PatientId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (entryId == null || entryId == undefined) {
            log("PUT", "/patient/:PatientId/prescriptions", "Patient Medical Consultation entryId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (prescription == null || prescription == undefined) {
            log("PUT", "/patient/:PatientId/prescriptions", "Patient payload detected but no patient prescriptions on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        prescription.PatientId = patientId;


        log("PUT", "/patient/:PatientId/prescriptions", "Patient prescriptions entry to be inserted is [" + JSON.stringify(prescription) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.update({ "_id": entryId }, prescription, function (err, doc) {
            if (err) {
                log("PUT", "/patient/:PatientId/prescriptions", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/patient/:PatientId/prescriptions", "Records were added successfully...");
                res.send({
                    Message: 'Records were added successfully...'
                });
            }
        });
    });


    /**
     * 
     * Medical Observations
     */


    /* GET Patient Medical observations by Id */
    app.get('/patient/:PatientId/observations', function (req, res) {

        var DB_COLLECTION_NAME = "observations";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("GET", "/patient/:PatientId/observations", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PatientId": id }, {}, function (e, docs) {

            log("GET", "/patient/:PatientId/observations", "Found: [" + JSON.stringify({ MedicalObservations: docs }) + "]");
            res.send({ MedicalObservations: docs });

        });
    });

    /* POST to Add Patient observations */
    app.post('/patient/:PatientId/observations', function (req, res) {

        var DB_COLLECTION_NAME = "observations";
        // Set our internal DB variable
        var db = req.db;

        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("POST", "/patient/:PatientId/observations", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var observations = req.body.MedicalObservations;

        if (observations == null || observations == undefined) {
            log("POST", "/patient/:PatientId/observations", "Patient payload detected but no patient medical observations on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each appointment entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        var consultationsEntries = observations.length;
        for (var i = 0; i < consultationsEntries; i++) {
            observations[i].PatientId = id;
        }


        log("POST", "/patient/:PatientId/observations", "Patient appointment entry to be inserted is [" + JSON.stringify(observations) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.insert(observations, function (err, doc) {
            if (err) {
                log("POST", "/patient/:PatientId/observations", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("POST", "/patient/:PatientId/observations", "Records were added successfully...");
                res.send({
                    MedicalObservations: doc
                });
            }
        });
    });

    /* PUT to update Patient observations */
    app.put('/patient/:PatientId/observations/:entryId', function (req, res) {

        var DB_COLLECTION_NAME = "observations";
        // Set our internal DB variable
        var db = req.db;

        var patientId = req.params.PatientId;
        var entryId = req.params.entryId;
        var observation = req.body.MedicalObservation;

        if (patientId == null || patientId == undefined) {
            log("PUT", "/patient/:PatientId/observations", "PatientId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (entryId == null || entryId == undefined) {
            log("PUT", "/patient/:PatientId/observations", "Patient Medical Consultation entryId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (observation == null || observation == undefined) {
            log("PUT", "/patient/:PatientId/observations", "Patient payload detected but no patient observations on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */

        observation.PatientId = patientId;


        log("PUT", "/patient/:PatientId/observations", "Patient observations entry to be inserted is [" + JSON.stringify(observation) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.update({ "_id": entryId }, observation, function (err, doc) {
            if (err) {
                log("PUT", "/patient/:PatientId/observations", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/patient/:PatientId/observations", "Records were added successfully...");
                res.send({
                    Message: 'Records were added successfully...'
                });
            }
        });
    });


    /**
     * 
     * Medical Patient's Carer
     */

    /* GET Patient Medical Carer by Id */
    app.get('/patient/:PatientId/carer', function (req, res) {

        var DB_COLLECTION_NAME = "carers";
        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("GET", "/patient/:PatientId/carer", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        var db = req.db;

        var collection = db.get(DB_COLLECTION_NAME);

        collection.find({ "PatientId": id }, {}, function (e, docs) {

            log("GET", "/patient/:PatientId/carer", "Found: [" + JSON.stringify({ Carer: docs }) + "]");
            res.send({ Carer: docs });

        });
    });

    /* POST to Add Patient Consultation */
    app.post('/patient/:PatientId/carer', function (req, res) {

        var DB_COLLECTION_NAME = "carers";
        // Set our internal DB variable
        var db = req.db;

        var id = req.params.PatientId;

        if (id == null || id == undefined) {
            log("POST", "/patient/:PatientId/carer", "Id empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }


        var carer = req.body.Carer;

        if (carer == null || carer == undefined) {
            log("POST", "/patient/:PatientId/carer", "Patient payload detected but no patient medical carer on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each carer entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */
        carer.PatientId = id;


        log("POST", "/patient/:PatientId/carer", "Patient carer entry to be inserted is [" + JSON.stringify(carer) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);
        var carerId = null;
        var newCarer = null;

        // Insert row to MongoDB
        collection.insert(carer, function (err, doc) {
            if (err) {
                log("POST", "/patient/:PatientId/carer", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {

                newCarer = doc;
                carerId = doc._id;
                log("POST", "/patient/:PatientId/carer", "Carer [" + carerId + "] was added successfully...");

                /**
                 * Adding this CarerId into PatientId record:
                 * 
                 * 1. First let's retrieve Patient record:
                 * 2. Then let's update its CarerId
                 * 3. Finally lets PUT it back.
                 */

                collection = db.get("patients");

                // 1)
                collection.find({ "_id": id }, {}, function (e, docs) {
                    var patient = docs[0];
                    
                    // 2)
                    delete patient._id;
                    patient.CarerId = carerId;
                    patient.ContactMethod = "Carer";

                    // 3) 
                    log("PUT", "/patient/carer", "Updating Patient CarerId with full payload [" + JSON.stringify(patient) + "]");

                    collection.update({ "_id": id }, patient, function (err, doc) {
                        if (err) {
                            log("PUT", "/patient/carer", "Oops, something wrong just happened while updating Patient CarerId.");
                            log("PUT", "/patient/carer", "Error [" + err + "]");
                            res.send({
                                Message: 'Oops, something wrong just happened while updating Patient CarerId.'
                            });
                        }
                        else {
                            // Return succes answer
                            log("PUT", "/patient/carer", "Patient CarerId was updated successfully...");
                            res.send({
                                Carer: newCarer
                            });
                        }
                    });
                });
            }
        });
    });

    /* PUT to update Patient Consultation */
    app.put('/patient/:PatientId/carer/:entryId', function (req, res) {

        var DB_COLLECTION_NAME = "carers";
        // Set our internal DB variable
        var db = req.db;

        var patientId = req.params.PatientId;
        var entryId = req.params.entryId;
        var carer = req.body.Carer;

        if (patientId == null || patientId == undefined) {
            log("PUT", "/patient/:PatientId/carer", "PatientId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (entryId == null || entryId == undefined) {
            log("PUT", "/patient/:PatientId/carer", "Patient Medical Consultation entryId empty or invalid... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }
        if (carer == null || carer == undefined) {
            log("PUT", "/patient/:PatientId/carer", "Patient payload detected but no patient carer on it... Nothing to do...");
            res.status(400).end();//Bad request...
            return;
        }

        /**
         * Ovrriding PatientId in each entry with default Patient Id given as part of the URI.
         * This way, whether they were given or not, we default to the Patient Id given as part of the URI.
         */
        carer.PatientId = patientId;

        log("PUT", "/patient/:PatientId/carer", "Patient carer entry to be inserted is [" + JSON.stringify(carer) + "]");

        // Set collection
        var collection = db.get(DB_COLLECTION_NAME);

        // Insert row to MongoDB
        collection.update({ "_id": entryId }, carer, function (err, doc) {
            if (err) {
                log("PUT", "/patient/:PatientId/carer", "Oops, something wrong just happened.");
                res.send({
                    Message: 'Oops, something wrong just happened.'
                });
            }
            else {
                // Return succes answer
                log("PUT", "/patient/:PatientId/carer", "Records were added successfully...");
                res.send({
                    Message: 'Records were added successfully...'
                });
            }
        });
    });

};

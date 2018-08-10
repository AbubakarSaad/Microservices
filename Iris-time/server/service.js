'use strict';

const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');

const config = require('../config/config');

// geo: AIzaSyA67okywfD2Y8mf5XKA4GOe4AR2RlAV3JM
// https://maps.googleapis.com/maps/api/geocode/json?address=canada&key=AIzaSyDYZbblFX-Ko0MK_P7UXNJKUmm6sFnzjf8
// https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key=AIzaSyA67okywfD2Y8mf5XKA4GOe4AR2RlAV3JM
service.get('/service/:location', (req, res, next) => {
    
    request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + req.params.location +  '&key=' + config.token, (err, response) => {
        if(err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log(response);
        // res.json(response.body.results[0].geometry.location);        
        const location = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X'); // '+' means we get the integer back

        request.get('https://maps.googleapis.com/maps/api/timezone/json?location=' + location.lat + ',' + location.lng + '&timestamp=' + timestamp +'&key=' + config.token, (err, resp) => {
            if(err) {
                console.log(err);
                return res.sendStatus(500);
            }

            const result = resp.body;
            const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM Do YYYY, h:mm:ss a');

            res.json({ result: timeString });
        })

    });
});


module.exports = service;
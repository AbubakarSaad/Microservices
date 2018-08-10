'use strict';

const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');
const config = require('../config/config');

const server = http.createServer(service);

const witToken = config.witToken;
const witClient = require('../server/witClient')(witToken);

const slackToken = config.slackToken;
const slackLogLevel = 'info';

const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => {
    server.listen(3000);
});


server.on('listening', () => {
    console.log(`IRIS is listening on ${server.address().port} in ${service.get('env')} mode.`);
});
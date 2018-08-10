'use strict';

const { RTMClient } = require('@slack/client');
const { CLIENT_EVENTS } = require('@slack/client');  // THIS HAS BEEN REMOVED
const { RTM_EVENTS } = require('@slack/client');  // THIS HAS BEEN REMOVED
let rtm = null;
let nlp = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
}

function handleOnMessage(message) {
    const conversationId = 'C745MSHC4';

    if(message.text.toLowerCase().includes('iris')) {
        nlp.ask(message.text, (err, res) => {
            if(err) {
                console.log(err);
                return;
            }
    
            try {
                if(!res.intent || !res.intent[0] || !res.intent[0].value) {
                    throw new Error("Could not extract intent.");
                }


                const intent = require('./intents/' + res.intent[0].value + 'Intent');

                intent.process(res, function(error, response){
                    if(error) {
                        console.log(error.message);
                        return;
                    }

                    return rtm.sendMessage(response, message.channel);
                })
            } catch(err) {
                console.log(err);
                console.log(res);
                rtm.sendMessage("Sorry, I don't know what you are talking about!", message.channel);
            }

            // if(!res.intent) {
            //     return rtm.sendMessage("Sorry, I don't know what you are talking about.", message.channel);
            // } else if(res.intent[0].value == 'time' && res.location) {
            //     return rtm.sendMessage(`I don't know the time in ${res.location[0].value}`, message.channel);
            // }
    
    
    
            // The RTM client can send simple string messages
            // rtm.sendMessage('Sorry, I did not understand', message.channel)
            // .then((res) => {
            //     // `res` contains information about the posted message
            //     console.log('Message sent: ', res.ts);
            // });
    
        });
    }

    
    

    
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}


module.exports.init = function slackClient(token, logLevel, nlpClient) {

    // The client is initialized and then started to get an active connection to the platform
    rtm = new RTMClient(token, {logLevel: logLevel});
    nlp = nlpClient;
    addAuthenticatedHandler(rtm, handleOnAuthenticated);
    rtm.on('message', handleOnMessage);
    return rtm;

}


module.exports.addAuthenticatedHandler = addAuthenticatedHandler;

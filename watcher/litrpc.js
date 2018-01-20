var config = require('./config');
var JsonRPC = require('simple-jsonrpc-js');
var WebSocket = require('ws');

function connect() {
    return new Promise(function(resolve, reject){
        var jrpc = new JsonRPC();
        var socket = new WebSocket("ws://127.0.0.1:8001/ws", 
                                   { origin: 'http://localhost' });

        socket.onmessage = function(event) {
            jrpc.messageHandler(event.data);
        };

        jrpc.toStream = function(_msg){
            socket.send(_msg);
        };

        socket.onerror = function(error) {
            console.error("Error: " + error.message);
        };

        socket.onclose = function(event) {
            if (event.wasClean) {
                console.info('Connection close was clean');
            } else {
                console.error('Connection suddenly close');
            }
            console.info('close code : ' + event.code + ' reason: ' + event.reason);
        };

        socket.onopen = function() {
            resolve(jrpc);
        };
    });
}

module.exports = connect;
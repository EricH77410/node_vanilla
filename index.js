/* 
Primary file for the API
*/

// Dependencies

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all request with a string
const server = http.createServer((req, res) => {
    // Get the url and parse it
    const parseUrl = url.parse(req.url, true);

    // Get the path from the url
    const path = parseUrl.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g,'');

    // get the query string as an object
    const queryStringObj = parseUrl.query;

    // Get the http method
    const methode = req.method.toLowerCase();

    //Get the headers as an object
    const header = req.headers

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', (data)=>{
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should go to, if not found use the not found one
        var chooseHandler = typeof(router[trimedPath]) !== 'undefined' ? router[trimedPath] : handlers.notFound

        // Construct the data object to send to the handler
        var data = {
            'trimedPath': trimedPath,
            'query': queryStringObj,
            'method': methode,
            'headers': header,
            'payload': buffer
        }

        // Route the request to the handler
        chooseHandler(data, function (statusCode, payload){
            // Use the status code called back by the handler or default 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler or default {}
            payload = typeof(payload) == 'object' ? payload : {}

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request
            console.log('Returning this response: ', statusCode, payloadString);

        });    
        
    });
    
});

// Start the server, and have it listen on port 5000
server.listen(5001, () => {
    console.log('The server is listening on port 5001');
});

// Define Handlers
var handlers = {}

// Sample Handler
handlers.sample = function(data, callback){
    // callback a http status code, and a payload (object)
    callback(406,{'name': 'sample handler'});
}

// 404
handlers.notFound = function(data, callback){
    callback(404);
}

// Define a Request Router
var router = {
    'sample': handlers.sample
}
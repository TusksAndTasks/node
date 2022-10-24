import * as path from "path";
require('dotenv').config();
const http = require("http");

const PORT = 3000
let isError = false;


const server = http.createServer(function(request, response){
    response.setHeader('Content-Type', 'application/json');

    switch (request.url) {
        case '/greeting':
            try {
                if(isError){
                    throw new Error("You shouldn't have send /error request");
                }
                response.status = 200;
                response.end(JSON.stringify('Hello. Correct GET'));
            } catch (e) {
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break;
        case '/personal-greeting':
            try{
                if(request.method === 'POST'){
                    let body = '';
                    request.on('data',(data) => {
                        body += data.toString();
                    })
                    request.on('end',() => {
                        let data = JSON.parse(body)
                        if(data.name){
                            response.status = 200;
                            response.end(JSON.stringify(`Hello, ${data.name}. Correct POST`));
                        } else {}
                        response.status = 400;
                        response.end(JSON.stringify( "Bad request. Try send a 'name' property"))
                    })
                }
            } catch (e) {
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break;
        case '/joke':
            try {
                if(request.method === 'GET'){
                    response.status = 200;
                    response.end(JSON.stringify("My ex-wife still misses me… but her aim is gettin' better!"))
                } else if (request.method === 'POST') {
                    let body = '';
                    request.on('data',(data) => {
                        body += data.toString();
                    })
                    request.on('end',() => {
                        let data = JSON.parse(body)
                        if(data.joke){
                            response.status = 200;
                            response.end(JSON.stringify(`'${data.joke.split(' ').slice(-4).join(' ')}' Ha-ha, great joke!`));
                        } else {
                            response.status = 400;
                            response.end(JSON.stringify("Bad request. Try to tell a joke!"))
                        }
                    })
                }  else {
                    throw new Error('incorrect request')
                }
            } catch (e) {
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break;
        case '/secret':
            try {
                response.status = 200;
                response.end(JSON.stringify(`Secret message is - ${process.env.NODE_ENV}`))
            } catch (e){
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break;
        case '/header':
            try {
                http.request({port: PORT, host: '127.0.0.1'}).setHeader('Keep-Alive', 'timeout=10')
                response.setHeader('Keep-Alive', 'timeout=10')
                response.status = 200;
                response.end(JSON.stringify('I set your request header and my response header to "Keep-Alive: timeout=10"'));
            } catch (e){
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break;
        case '/cookie':
            try{
                response.setHeader('Set-Cookie', 'chocolate=cookie')
                response.status = 200;
                response.end(JSON.stringify('Enjoy my chocolate cookie!'))
            } catch (e){
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break
        case '/cookies':
            try {
                const cookies = request.headers?.cookie
                response.status = 200;
                response.end(JSON.stringify(`Here's your cookies - ${cookies}`))
            } catch (e){
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break
        case '/redirect':
            try {
                response.writeHead(301, {"Location": "http://localhost:3000/greeting"})
                response.end()
            } catch (e){
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break
        case '/error':
            try {
                isError = true;
                response.status = 200;
                response.end(JSON.stringify('Whoopsy-daisy, greeting-endpoint now return error.'))
            } catch (e) {
                response.status = 500;
                response.end(JSON.stringify(`Hmmm.Something is wrong - ${e.message} `))
            }
            break
        default:
            response.status = 404;
            response.end(JSON.stringify( "I don't know that command"))
            break;
    }
}).listen(PORT, 'localhost', 511, () => console.log(`Running on 3000`));
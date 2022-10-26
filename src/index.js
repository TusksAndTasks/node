const http = require("http");
const url = require('url');
const { createFile } = require('./modules/createFile')
const { readFile } = require('./modules/readFile')
const { updateFile } = require('./modules/updateFile')
const { deleteFile } = require('./modules/deleteFile')
const { errorHandlerWrapper } = require('./modules/errorHandler')

const PORT = 3000

const server = http.createServer(function(request, response){
    response.setHeader('Content-Type', 'application/json');

    const create = errorHandlerWrapper(createFile, response, request)
    const read = errorHandlerWrapper(readFile, response, request)
    const update = errorHandlerWrapper(updateFile, response, request)
    const unlink = errorHandlerWrapper(deleteFile, response, request)

    switch (url.parse(request.url).pathname.split('/')[1]) {
        case 'create':
            if(request.method !== 'POST'){
                response.status = 400;
                response.end(JSON.stringify('Incorrect method'))
            }
            create();
            break
        case 'read':
            read();
            break
        case 'update':
            if(request.method !== 'PATCH') {
                response.status = 400;
                response.end(JSON.stringify('Incorrect method'))
            }
            update();
            break
        case 'delete':
            if(request.method !== 'DELETE'){
                response.status = 400;
                response.end(JSON.stringify('Incorrect method'))
            }
            unlink();
            break
        default:
            response.status = 404;
            response.end(JSON.stringify('Endpoint not found'));
            break
    }


}).listen(PORT, 'localhost', 511, () => console.log(`Running on 3000`));
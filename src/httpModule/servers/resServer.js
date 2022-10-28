const http = require("http");

const {errorHandlerWrapper} = require('./modules/errorHandler')
const {getData} = require('./modules/getData')
const {setNewData} = require('./modules/setNewData')
const {setFromFormData} = require('./modules/setFromFormData')

const PORT = 3000;

http.createServer(function(request, response){
    response.setHeader('Content-Type', 'application/json');

    switch (request.url) {
        case '/getData':
            errorHandlerWrapper(getData, response, request)()
            break;
        case '/setNewData':
            errorHandlerWrapper(setNewData, response, request)()
            break;
        case '/formData':
            errorHandlerWrapper(setFromFormData, response, request)()
            break;
    }

}).listen(PORT, 'localhost', 511, () => {process.stdout.write('Server running on 3000')});
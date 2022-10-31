const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');



const readFile = (request, response, next) => {
           const fileName = url.parse(request.url).pathname.split('/')[2]
           const readStream = fs.createReadStream(path.join(__dirname, '..', 'files', fileName));
           let fullContent = ''

           readStream.on('data', (chunk) => {
               fullContent = fullContent ? fullContent + chunk.toString() : chunk.toString();
           })

           readStream.on('end', () => {
               response.status(200).json(fullContent);
               next();
           } )

}

module.exports = {readFile}
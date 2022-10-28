const fs = require('node:fs');
const path = require('node:path')

const getData = ( response, request ) => {

    const readStream = fs.createReadStream(path.resolve(__dirname, '..', 'files', 'getContent.txt'));

    let fullContent = ''

    readStream.on('data', (chunk) => {
        fullContent = fullContent ? fullContent + chunk.toString() : chunk.toString();
    })

    readStream.on('end', () => {
        response.status = 200;
        response.write(JSON.stringify(fullContent))
        response.end();
    } )
}

module.exports = {getData}
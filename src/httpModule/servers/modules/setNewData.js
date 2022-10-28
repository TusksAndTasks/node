const fs = require('node:fs');
const path = require('node:path')

const setNewData = (response, request) => {

    let fullRequestData = '';

    request.on('data', (data) => {
        fullRequestData = fullRequestData ? fullRequestData + data : data;
    })

    request.on('end', () => {
        const parsedData = JSON.parse(fullRequestData);
        const filePath = path.join(__dirname, '..', 'files', `postContent.txt`);
        const writeStream = fs.createWriteStream(filePath);
        writeStream.write(parsedData.data);
    } )

    response.status = 200;
    response.end(JSON.stringify(`Your post data written in file postContent.txt`));
}

module.exports = {setNewData};
const fs = require('node:fs');
const path = require('node:path');

async function updateData (newData, oldData) {
    if(typeof newData === 'string'){
        return oldData + newData;
    }

    const parsedOldData = JSON.parse(oldData);

    Object.assign(parsedOldData, newData);
    return parsedOldData;
}


const updateFile = (response, request) => {
    let requestData = ''

    request.on('data', (data) => {
        requestData = requestData ? requestData + data : data;
    })

    request.on('end', () => {
        const parsedRequest = JSON.parse(requestData);
        let fullFileData = '';
        const filePath = path.join(__dirname, '..', 'files', parsedRequest.filename);
        const readStream = fs.createReadStream(filePath);

        readStream.on('data', (chunk) => {
            fullFileData = fullFileData ? fullFileData + chunk.toString() : chunk.toString();
        })

        readStream.on('end', async () => {
            const updatedFile = await updateData(parsedRequest.data, fullFileData);
           fs.createWriteStream(filePath).write(JSON.stringify(updatedFile) )

           response.status = 200;
           response.end(JSON.stringify(` Yor data has been successfully updated`));

        })
    })

}

module.exports = {updateFile}
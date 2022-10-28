const fs = require('node:fs');
const path = require('node:path')

const parseFormData = (data) => {
    const dataForm = data.toString();

    const unparsedDataBlocks = dataForm.split('----------------------------').slice(1, -1);

    const dataReduced = unparsedDataBlocks.reduce((accumulator, currentData ) => {
        const valueUnparsed = currentData.split(/\r\n/);
        const value = valueUnparsed.slice(valueUnparsed.length - 2, valueUnparsed.length - 1)[0]
        const key = currentData.split('"')[1].replace(/\n/g);

        accumulator[key] = value;

        return accumulator;
    }, {})

    return dataReduced;
}


const setFromFormData = (response, request) => {

    let fullRequestData = '';

    request.on('data', (data) => {
        fullRequestData = fullRequestData ? fullRequestData + data : data;
    })

    request.on('end', () => {
        const filePath = path.join(__dirname, '..', 'files', `formContent.txt`);
        const writeStream = fs.createWriteStream(filePath);
        const parsedFormData = parseFormData(fullRequestData);

        writeStream.write(parsedFormData.data);
    } )

    response.status = 200;
    response.end(JSON.stringify(`Your form data written in file formContent.txt`));
}

module.exports = {setFromFormData};